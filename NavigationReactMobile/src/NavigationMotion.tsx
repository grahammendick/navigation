import * as React from 'react';
import { State, Crumb, StateNavigator } from 'navigation';
import Motion from './Motion';
import Scene from './Scene';
import SharedElementContext from './SharedElementContext';
import SharedElementRegistry from './SharedElementRegistry';
import withStateNavigator from './withStateNavigator';
import { NavigationMotionProps } from './Props';
type NavigationMotionState = { rest: boolean, stateNavigator: StateNavigator };
type SceneContext = { key: number, state: State, data: any, url: string, crumbs: Crumb[], nextState: State, nextData: any, mount: boolean };

class NavigationMotion extends React.Component<NavigationMotionProps, NavigationMotionState> {
    private sharedElementRegistry = new SharedElementRegistry();
    constructor(props: NavigationMotionProps) {
        super(props);
        this.state = {rest: false, stateNavigator: null};
    }
    static defaultProps = {
        duration: 300,
    }
    static getDerivedStateFromProps(props: NavigationMotionProps, {stateNavigator: prevStateNavigator}: NavigationMotionState) {
        var {stateNavigator} = props;
        return stateNavigator !== prevStateNavigator ? {rest: false, stateNavigator} : null;
    }
    getSharedElements() {
        var {crumbs, oldUrl} = this.props.stateNavigator.stateContext;
        if (oldUrl !== null && !this.state.rest) {
            var oldScene = oldUrl.split('crumb=').length - 1;
            return this.sharedElementRegistry.getSharedElements(crumbs.length, oldScene);
        }
        return [];
    }
    clearScene(index) {
        this.setState(({rest: prevRest}) => {
            var scene = this.getScenes().filter(scene => scene.key === index)[0];
            if (!scene)
                this.sharedElementRegistry.unregisterSharedElement(index);
            var rest = prevRest || (scene && scene.mount);
            return (rest !== prevRest) ? {rest} : null;
        });
    }
    getScenes(): SceneContext[]{
        var {stateNavigator} = this.props;
        var {crumbs, nextCrumb} = stateNavigator.stateContext;
        return crumbs.concat(nextCrumb).map(({state, data, url}, index, crumbsAndNext) => {
            var preCrumbs = crumbsAndNext.slice(0, index);
            var {state: nextState, data: nextData} = crumbsAndNext[index + 1] || {state: undefined, data: undefined};
            return {key: index, state, data, url, crumbs: preCrumbs, nextState, nextData, mount: url === nextCrumb.url};
        });
    }
    getStyle(mounted: boolean, {state, data, crumbs, nextState, nextData, mount}: SceneContext) {
        var {unmountedStyle, mountedStyle, crumbStyle} = this.props;
        var styleProp = !mounted ? unmountedStyle : (mount ? mountedStyle : crumbStyle);
        return typeof styleProp === 'function' ? styleProp(state, data, crumbs, nextState, nextData) : styleProp;
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
                    {styles => (
                        styles.map(({data: {key, state, data}, style}) => {
                            var scene = <Scene crumb={key} renderScene={renderScene} /> ;
                            return children(style, scene, key, crumbs.length === key, state, data);
                        }).concat(
                            sharedElementMotion && sharedElementMotion({
                                key: 'sharedElements',
                                sharedElements: this.getSharedElements(),
                                progress: styles[crumbs.length] && styles[crumbs.length].progress,
                                duration,
                            })
                        )
                    )}
                </Motion>
            </SharedElementContext.Provider>
        );
    }
}

export default withStateNavigator(NavigationMotion);
