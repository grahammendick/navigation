import { StateNavigator } from 'navigation';
import * as React from 'react';
var Transition = require('react-move').Transition;
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
        this.movingSharedElement = this.movingSharedElement.bind(this);
        this.getSharedElements = this.getSharedElements.bind(this);
        this.state = {scenes: {}};
    }
    static contextTypes = {
        stateNavigator: React.PropTypes.object
    }
    static childContextTypes = {
        registerSharedElement: React.PropTypes.func,
        unregisterSharedElement: React.PropTypes.func,
        movingSharedElement: React.PropTypes.func,
        getSharedElements: React.PropTypes.func
    }
    getChildContext() {
        return {
            registerSharedElement: this.registerSharedElement,
            unregisterSharedElement: this.unregisterSharedElement,
            movingSharedElement: this.movingSharedElement,
            getSharedElements: this.getSharedElements
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
            var element = state.renderScene(this.getSceneData(data, url, prevScenes), this.moveScene(url));
            scenes[url] = {...scenes[url], element};
            return {scenes};
        });
    }
    moveScene(url) {
        return data => {
            this.setState(({scenes: prevScenes}) => {
                var scenes = {...prevScenes};
                scenes[url] = {...scenes[url], data};
                return {scenes};
            });
        };
    }
    registerSharedElement(url, name, ref, measurements, data) {
        this.sharedElements[url] = this.sharedElements[url] || {};
        this.sharedElements[url][name] = {ref, measurements, data};
    }
    unregisterSharedElement(url, name) {
        if (this.sharedElements[url])
            delete this.sharedElements[url][name];
    }
    movingSharedElement(url, name, style) {
        this.sharedElements[url][name].style = style;
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
            return {scenes};
        });
    }
    getScenes(){
        var {crumbs, nextCrumb} = this.getStateNavigator().stateContext;
        return crumbs.concat(nextCrumb).map(({state, data, url}) => (
            {state, data, url, scene: this.state.scenes[url], mount: url === nextCrumb.url}
        ));
    }
    getSceneData(data, url, prevState?) {
        var scene = (prevState || this.state.scenes)[url];
        return {...data, ...(scene && scene.data)};
    }
    getStyle(styleProp, {state, data, url}, strip = false) {
        return typeof styleProp === 'function' ? styleProp(state, this.getSceneData(data, url)) : styleProp;
    }
    render() {
        var {unmountedStyle, mountedStyle, crumbStyle, style, children} = this.props;
        return (this.getStateNavigator().stateContext.state &&
            <Transition
                duration={300} easing="easeLinear"
                data={this.getScenes()}
                getKey={sceneContext => sceneContext.url}
                enter={sceneContext => this.getStyle(unmountedStyle, sceneContext, true)}
                update={sceneContext => this.getStyle(sceneContext.mount ? mountedStyle : crumbStyle, sceneContext)}
                leave={sceneContext => this.getStyle(unmountedStyle, sceneContext)}
                onRest={() => this.clearScenes()}>
                {tweenStyles => (
                    <View style={style}>
                        {tweenStyles.map(({key, data: {scene, state, data, url}, state: style}) => (
                            children(style, scene && scene.element, key, state, this.getSceneData(data, url))
                        ))}
                    </View>
                )}
            </Transition>
        );
    }
}

export default NavigationMotion;
