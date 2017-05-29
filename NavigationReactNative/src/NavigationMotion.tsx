import { StateNavigator } from 'navigation';
import * as React from 'react';
import { Transition } from 'react-move';
import { View } from 'react-native';

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
            var {url} = this.getStateNavigator().stateContext;
            scenes[url] = {...scenes[url], element: state.renderScene(data)};
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
    clearScenes() {
        this.setState(({scenes: prevScenes}) => {
            var scenes = {...prevScenes};
            var urls = this.getScenes().reduce((urls, {url}) => {
                urls[url] = true;
                return urls;
            }, {});
            for(var url in prevScenes) {
                if (!urls[url]) {
                    delete scenes[url];
                    delete this.sharedElements[url];
                }
            }
            return {scenes, rest: true};
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
            <Transition
                duration={duration} easing={easing}
                data={this.getScenes()}
                getKey={({url}) => url}
                enter={({state, data}) => this.getStyle(stateContext.oldState ? unmountedStyle : mountedStyle, state, data)}
                update={({mount, state, data}) => this.getStyle(mount ? mountedStyle : crumbStyle, state, data)}
                leave={({state, data}) => this.getStyle(unmountedStyle, state, data)}
                onRest={() => this.clearScenes()}>
                {tweenStyles => (
                    <View style={style}>
                        {tweenStyles.map(({key, data: {scene, state, data, url}, state: style}) => (
                            children(style, scene && scene.element, key, state, data)
                        ))}
                        {sharedElementMotion && sharedElementMotion({
                            sharedElements: !this.state.rest ? this.getSharedElements() : [],
                            duration, easing
                        })}
                    </View>
                )}
            </Transition>
        );
    }
}

export default NavigationMotion;
