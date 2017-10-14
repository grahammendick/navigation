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
        easing: 'easeLinear'
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
        var stateNavigator = this.getStateNavigator();
        stateNavigator.onNavigate(this.onNavigate);
        var {startStateKey, startNavigationData} = this.props;
        if (startStateKey) {
            stateNavigator.stateContext.clear();
            stateNavigator.navigate(startStateKey, startNavigationData);
        }
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
    registerSharedElement(url, name, ref, measurements, data) {
        this.sharedElements[url] = this.sharedElements[url] || {};
        this.sharedElements[url][name] = {ref, measurements, data};
    }
    unregisterSharedElement(url, name) {
        if (this.sharedElements[url])
            delete this.sharedElements[url][name];
    }
    getSharedElements() {
        var {url, oldUrl} = this.getStateNavigator().stateContext;
        var oldSharedElements = this.sharedElements[oldUrl];
        var mountedSharedElements = this.sharedElements[url];
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
        var {unmountedStyle, mountedStyle, crumbStyle, style, children, duration, easing, sharedElementMotion} = this.props;
        var {stateContext} = this.getStateNavigator();
        return (stateContext.state &&
            <Motion
                data={this.getScenes()}
                getKey={({key}) => key}
                enter={({state, data}) => this.getPropValue(stateContext.oldState ? unmountedStyle : mountedStyle, state, data)}
                update={({mount, state, data}) => this.getPropValue(mount ? mountedStyle : crumbStyle, state, data)}
                leave={({state, data}) => this.getPropValue(unmountedStyle, state, data)}
                duration={({state, data}) => this.getPropValue(duration, state, data)}
                easing={({state, data}) => this.getPropValue(easing, state, data)}
                onRest={({key}) => this.clearScene(key)}>
                {tweenStyles => (
                    tweenStyles.map(({key, data: {scene, state, data, url}, style: tweenStyle}) => (
                        children(tweenStyle, scene, key, state, data)
                    )).concat(
                        sharedElementMotion && sharedElementMotion({
                            sharedElements: !this.state.rest ? this.getSharedElements() : [],
                            duration: this.getPropValue(duration, stateContext.state, stateContext.data),
                            easing: this.getPropValue(easing, stateContext.state, stateContext.data)
                        })
                    )
                )}
            </Motion>
        );
    }
}

export default NavigationMotion;
