import * as React from 'react';
import { State, Crumb, StateNavigator } from 'navigation';
import Motion from './Motion';
import Scene from './Scene';
import SharedElementContext from './SharedElementContext';
import SharedElementRegistry from './SharedElementRegistry';
import withStateNavigator from './withStateNavigator';
import Freeze from './Freeze';
import { NavigationMotionProps } from './Props';
type NavigationMotionState = {stateNavigator: StateNavigator, keys: string[]};
type SceneContext = {key: string, state: State, data: any, url: string, crumbs: Crumb[], nextState: State, nextData: any, mount: boolean, fromUnmounted: boolean};
type MotionStyle = {style: any, data: SceneContext, key: string, rest: boolean, progress: number, start: any, end: any };

class NavigationMotion extends React.Component<NavigationMotionProps, NavigationMotionState> {
    private sharedElementRegistry = new SharedElementRegistry();
    constructor(props: NavigationMotionProps) {
        super(props);
        this.state = {stateNavigator: null, keys: []};
    }
    static defaultProps = {
        duration: 300,
    }
    static getDerivedStateFromProps({stateNavigator}: NavigationMotionProps, {keys: prevKeys, stateNavigator: prevStateNavigator}: NavigationMotionState) {
        if (stateNavigator === prevStateNavigator)
            return null;
        var {state, crumbs, nextCrumb} = stateNavigator.stateContext;
        var prevState = prevStateNavigator && prevStateNavigator.stateContext.state;
        var currentKeys = crumbs.concat(nextCrumb).map((_, i) => '' + i);
        var newKeys = currentKeys.slice(prevKeys.length);
        var keys = prevKeys.slice(0, currentKeys.length).concat(newKeys);
        if (prevKeys.length === keys.length && prevState !== state)
            keys[keys.length - 1] += '+';
        return {keys, stateNavigator};
    }
    getSharedElements() {
        var {crumbs, oldUrl} = this.props.stateNavigator.stateContext;
        if (oldUrl !== null) {
            var oldScene = oldUrl.split('crumb=').length - 1;
            return this.sharedElementRegistry.getSharedElements(crumbs.length, oldScene);
        }
        return [];
    }
    clearScene(index) {
        var scene = this.getScenes().filter(scene => scene.key === index)[0];
        if (!scene)
            this.sharedElementRegistry.unregisterSharedElement(index);
    }
    getScenes(): SceneContext[]{
        var {stateNavigator} = this.props;
        var {keys} = this.state;
        var {crumbs, nextCrumb, oldUrl} = stateNavigator.stateContext;
        var backward = oldUrl && oldUrl.split('crumb=').length > crumbs.length + 1;
        return crumbs.concat(nextCrumb).map(({state, data, url}, index, crumbsAndNext) => {
            var preCrumbs = crumbsAndNext.slice(0, index);
            var {state: nextState, data: nextData} = crumbsAndNext[index + 1] || {state: undefined, data: undefined};
            var mount = url === nextCrumb.url;
            var fromUnmounted = mount && !backward;
            return {key: keys[index], state, data, url, crumbs: preCrumbs, nextState, nextData, mount, fromUnmounted };
        });
    }
    getStyle(mounted: boolean, {state, data, crumbs, nextState, nextData, mount, fromUnmounted}: SceneContext) {
        var {unmountedStyle, mountedStyle, crumbStyle} = this.props;
        var styleProp = !mounted ? unmountedStyle : (mount ? mountedStyle : crumbStyle);
        fromUnmounted = (mounted && mount) ? fromUnmounted : undefined;
        var style = typeof styleProp === 'function' ? styleProp(state, data, crumbs, nextState, nextData, fromUnmounted) : styleProp;
        return {...style, __marker: !mounted ? 1 : (mount ? 0 : -1)};
    }
    static getMotion(styles: MotionStyle[]) {
        var moving = false, mountMoving = false, mountDuration: number, mountProgress: number;
        for(var {rest, progress, data: {mount}, style: {duration}} of styles) {
            if (mount) {
                mountMoving = !rest;
                mountDuration = duration;
                mountProgress = progress;
            }
            moving = moving || !rest;
        }
        return {rest: !moving, mountRest: !mountMoving, mountDuration, mountProgress};
    }
    render() {
        var {children, duration, renderScene, sharedElementMotion, stateNavigator} = this.props;
        var {stateContext: {crumbs, oldState}, stateContext} = stateNavigator;
        return (stateContext.state &&
            <SharedElementContext.Provider value={this.sharedElementRegistry}>
                <Motion<SceneContext>
                    data={this.getScenes()}
                    getKey={({key}) => key}
                    enter={scene => this.getStyle(!oldState, scene)}
                    update={scene => this.getStyle(true, scene)}
                    leave={scene => this.getStyle(false, scene)}
                    onRest={({key}) => this.clearScene(key)}
                    duration={duration}>
                    {styles => {
                        var {rest, mountRest, mountDuration, mountProgress} = NavigationMotion.getMotion(styles);
                        return (
                            styles.map(({data: {key, state, data}, style: {__marker, duration, ...style}}) => {
                                var crumb = +key.replace(/\++$/, '');
                                var scene = <Scene crumb={crumb} rest={rest} renderScene={renderScene} />;
                                return (
                                    <Freeze key={key} enabled={rest && crumb < this.getScenes().length - 1}>
                                        {children(style, scene, key, crumbs.length === crumb, state, data)}
                                    </Freeze>
                                );
                            }).concat(
                                sharedElementMotion && sharedElementMotion({
                                    key: 'sharedElements',
                                    sharedElements: !mountRest ? this.getSharedElements() : [],
                                    progress: mountProgress,
                                    duration: mountDuration ?? duration,
                                })
                            )
                        )}
                    }
                </Motion>
            </SharedElementContext.Provider>
        );
    }
}

export default withStateNavigator(NavigationMotion);
