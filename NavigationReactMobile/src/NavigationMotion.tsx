import { StateNavigator } from 'navigation';
import * as React from 'react';
import Motion from './Motion';
import Scene from './Scene';

class NavigationMotion extends React.Component<any, any> {
    private sharedElements = {};
    context: {
        stateNavigator: StateNavigator
    }
    constructor(props, context) {
        super(props, context);
        this.onNavigate = this.onNavigate.bind(this);
        this.registerSharedElement = this.registerSharedElement.bind(this);
        this.unregisterSharedElement = this.unregisterSharedElement.bind(this);
        this.state = {scenes: {}, rest: false};
    }
    static defaultProps = {
        duration: 300,
    }
    static contextTypes = {
        stateNavigator: () => {}
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
    getSharedElements() {
        var {crumbs, oldUrl} = this.getStateNavigator().stateContext;
        if (!oldUrl || crumbs.length === oldUrl.split('crumb=').length - 1)
            return [];
        var oldSharedElements = this.sharedElements[oldUrl.split('crumb=').length - 1];
        var mountedSharedElements = this.sharedElements[crumbs.length];
        var sharedElements = [];
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
        return crumbs.concat(nextCrumb).map(({state, data, url}, index) => (
            {key: index, state, data, url, scene: this.state.scenes[index], mount: url === nextCrumb.url}
        ));
    }
    getPropValue(prop, state, data) {
        return typeof prop === 'function' ? prop(state, data) : prop;
     }
    render() {
        var {unmountedStyle, mountedStyle, crumbStyle, style, children, duration, sharedElementMotion} = this.props;
        var {stateContext} = this.getStateNavigator();
        var index = stateContext.crumbs.length;
        return (stateContext.state &&
            <Motion
                data={this.getScenes()}
                getKey={({key}) => key}
                enter={({state, data}) => this.getPropValue(stateContext.oldState ? unmountedStyle : mountedStyle, state, data)}
                update={({mount, state, data}) => this.getPropValue(mount ? mountedStyle : crumbStyle, state, data)}
                leave={({state, data}) => this.getPropValue(unmountedStyle, state, data)}
                duration={duration}
                onRest={({key}) => this.clearScene(key)}>
                {tweenStyles => (
                    tweenStyles.map(({key, data: {scene, state, data, url}, progress, style: tweenStyle}) => (
                        (children as any)(tweenStyle, scene, key, index === key, state, data)
                    )).concat(
                        sharedElementMotion && sharedElementMotion({
                            key: 'sharedElements',
                            sharedElements: !this.state.rest ? this.getSharedElements() : [],
                            progress: tweenStyles[index] && tweenStyles[index].progress,
                            duration,
                        })
                    )
                )}
            </Motion>
        );
    }
}

export default NavigationMotion;
