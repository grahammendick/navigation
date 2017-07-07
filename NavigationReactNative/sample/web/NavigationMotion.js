import React from 'react';
import Motion from './Motion';
import Scene from './Scene';

class NavigationMotion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onNavigate = this.onNavigate.bind(this);
        this.registerSharedElement = this.registerSharedElement.bind(this);
        this.unregisterSharedElement = this.unregisterSharedElement.bind(this);
        this.state = {scenes: {}, rest: false};
        this.sharedElements = {};
    }
    getChildContext() {
        return {
            registerSharedElement: this.registerSharedElement,
            unregisterSharedElement: this.unregisterSharedElement
        };
    }
    getStateNavigator() {
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
            var {url} = stateNavigator.stateContext;
            scenes[url] = <Scene stateNavigator={stateNavigator}>{state.renderScene(data)}</Scene>;
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
    clearScene(url) {
        this.setState(({scenes: prevScenes, rest: prevRest}) => {
            var scenes = {...prevScenes};
            var scene = this.getScenes().filter(scene => scene.url === url)[0];
            if (!scene) {
                delete scenes[url];
                delete this.sharedElements[url];
            }
            var rest = prevRest || (scene && scene.mount);
            return {scenes, rest};
        });
    }
    getScenes(){
        var {crumbs, nextCrumb} = this.getStateNavigator().stateContext;
        return crumbs.concat(nextCrumb).map(({state, data, url}) => (
            {state, data, url, scene: this.state.scenes[url], mount: url === nextCrumb.url}
        ));
    }
    getStyle(styleProp, state, data) {
        return typeof styleProp === 'function' ? styleProp(state, data) : styleProp;
    }
    render() {
        var {unmountedStyle, mountedStyle, crumbStyle, style, children, duration, easing, sharedElementMotion} = this.props;
        var {stateContext} = this.getStateNavigator();
        return (stateContext.state &&
            <Motion
                duration={duration} easing={easing}
                data={this.getScenes()}
                getKey={({url}) => url}
                enter={({state, data}) => this.getStyle(stateContext.oldState ? unmountedStyle : mountedStyle, state, data)}
                update={({mount, state, data}) => this.getStyle(mount ? mountedStyle : crumbStyle, state, data)}
                leave={({state, data}) => this.getStyle(unmountedStyle, state, data)}
                onRest={({url}) => this.clearScene(url)}>
                {tweenStyles => (
                    <div style={style}>
                        {tweenStyles.map(({key, data: {scene, state, data, url}, style: tweenStyle}) => (
                            children(tweenStyle, scene, key, state, data)
                        ))}
                        {sharedElementMotion && sharedElementMotion({
                            sharedElements: !this.state.rest ? this.getSharedElements() : [],
                            duration, easing
                        })}
                    </div>
                )}
            </Motion>
        );
    }
}

NavigationMotion.defaultProps = {
    duration: 300,
    easing: 'easeLinear'
}
NavigationMotion.contextTypes = {
    stateNavigator: () => {}
}
NavigationMotion.childContextTypes = {
    registerSharedElement: () => {},
    unregisterSharedElement: () => {}
}

export default NavigationMotion;
