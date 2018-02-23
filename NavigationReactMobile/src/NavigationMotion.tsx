import { StateNavigator } from 'navigation';
import * as React from 'react';
import Motion from './Motion';
import Scene from './Scene';
import withStateNavigator from './withStateNavigator';
import { NavigationMotionProps, SharedElement } from './Props';

class NavigationMotion extends React.Component<NavigationMotionProps, any> {
    private sharedElements: { [scene: number]: { [name: string]: { ref: HTMLElement; data: any }; }; } = {};
    context: {
        stateNavigator: StateNavigator
    }
    constructor(props, context) {
        super(props, context);
        this.onNavigate = this.onNavigate.bind(this);
        this.registerSharedElement = this.registerSharedElement.bind(this);
        this.unregisterSharedElement = this.unregisterSharedElement.bind(this);
        var scenes = {};
        var stateNavigator = this.getStateNavigator();
        var {state, data, crumbs} = stateNavigator.stateContext;
        if (state)
            scenes[crumbs.length] = <Scene stateNavigator={stateNavigator}>{state.renderScene(data)}</Scene>;
        this.state = {scenes, rest: false};
    }
    static defaultProps = {
        duration: 300,
    }
    static contextTypes = {
        stateNavigator: () => null
    }
    static childContextTypes = {
        registerSharedElement: () => {},
        unregisterSharedElement: () => {}
    }
    getChildContext() {
        return {
            registerSharedElement: this.registerSharedElement,
            unregisterSharedElement: this.unregisterSharedElement
        };
    }
    private getStateNavigator(): StateNavigator {
        return this.props.stateNavigator || this.context.stateNavigator;
    }
    componentDidMount() {
        this.getStateNavigator().onNavigate(this.onNavigate);
    }
    componentWillUnmount() {
        this.getStateNavigator().offNavigate(this.onNavigate);
    }
    onNavigate(oldState, state, data) {
        this.setState(({scenes: prevScenes}) => {
            var scenes = {...prevScenes};
            var stateNavigator = this.getStateNavigator();
            var {crumbs} = stateNavigator.stateContext;
            scenes[crumbs.length] = <Scene stateNavigator={stateNavigator}>{state.renderScene(data)}</Scene>;
            return {scenes, rest: false};
        });
    }
    registerSharedElement(scene, name, ref, data) {
        this.sharedElements[scene] = this.sharedElements[scene] || {};
        this.sharedElements[scene][name] = {ref, data};
    }
    unregisterSharedElement(scene, name) {
        if (this.sharedElements[scene])
            delete this.sharedElements[scene][name];
    }
    getSharedElements(crumbs, oldUrl) {
        if (oldUrl === null || crumbs.length === oldUrl.split('crumb=').length - 1)
            return [];
        var oldSharedElements = this.sharedElements[oldUrl.split('crumb=').length - 1];
        var mountedSharedElements = this.sharedElements[crumbs.length];
        var sharedElements: SharedElement[] = [];
        for(var name in mountedSharedElements) {
            if (oldSharedElements && oldSharedElements[name]) {
                sharedElements.push({
                    name,
                    oldElement: oldSharedElements[name],
                    mountedElement: mountedSharedElements[name]
                })
            }
        }
        return sharedElements;
    }
    clearScene(index) {
        this.setState(({scenes: prevScenes, rest: prevRest}) => {
            var scenes = {...prevScenes};
            var scene = this.getScenes().filter(scene => scene.key === index)[0];
            if (!scene) {
                delete scenes[index];
                delete this.sharedElements[index];
            }
            var rest = prevRest || (scene && scene.mount);
            return {scenes, rest};
        });
    }
    getScenes(){
        var {crumbs, nextCrumb} = this.getStateNavigator().stateContext;
        return crumbs.concat(nextCrumb).map(({state, data, url}, index, crumbsAndNext) => {
            var preCrumbs = crumbsAndNext.slice(0, index);
            var postCrumb = crumbsAndNext[index + 1];
            return {key: index, state, data, url, crumbs: preCrumbs, nextState: postCrumb && postCrumb.state,
                nextData: postCrumb && postCrumb.data, scene: this.state.scenes[index], mount: url === nextCrumb.url};
        });
    }
    getStyle(mounted, {state, data, crumbs, nextState, nextData, mount}) {
        var {unmountedStyle, mountedStyle, crumbStyle} = this.props;
        var styleProp = !mounted ? unmountedStyle : (mount ? mountedStyle : crumbStyle)
        return typeof styleProp === 'function' ? styleProp(state, data, crumbs, nextState, nextData) : styleProp;
     }
    render() {
        var {children, duration, sharedElementMotion} = this.props;
        var {stateContext: {crumbs, oldUrl, oldState}, stateContext} = this.getStateNavigator();
        return (stateContext.state &&
            <Motion
                data={this.getScenes()}
                getKey={({key}) => key}
                enter={scene => this.getStyle(!oldState, scene)}
                update={scene => this.getStyle(true, scene)}
                leave={scene => this.getStyle(false, scene)}
                onRest={({key}) => this.clearScene(key)}
                duration={duration}>
                {tweenStyles => (
                    tweenStyles.map(({key, data: {scene, state, data, url}, style: tweenStyle}) => (
                        children(tweenStyle, scene, key, crumbs.length === key, state, data)
                    )).concat(
                        sharedElementMotion && sharedElementMotion({
                            sharedElements: !this.state.rest ? this.getSharedElements(crumbs, oldUrl) : [],
                            progress: tweenStyles[crumbs.length] && tweenStyles[crumbs.length].progress,
                            duration,
                        })
                    )
                )}
            </Motion>
        );
    }
}

export default withStateNavigator(NavigationMotion);
