import { StateNavigator } from 'navigation';
import * as React from 'react';
import { TransitionMotion } from 'react-motion';
import { View } from 'react-native';

class NavigationMotion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onNavigate = this.onNavigate.bind(this);
        this.registerSharedElement = this.registerSharedElement.bind(this);
        this.onRegisterSharedElement = this.onRegisterSharedElement.bind(this);
        this.offRegisterSharedElement = this.offRegisterSharedElement.bind(this);
        this.state = {scenes: {}};
        this.registrationHandlers = [];
    }
    static contextTypes = {
        stateNavigator: React.PropTypes.object
    }
    static childContextTypes = {
        registerSharedElement: React.PropTypes.func,
        onRegisterSharedElement: React.PropTypes.func,
        offRegisterSharedElement: React.PropTypes.func
    }
    getChildContext() {
        return {
            registerSharedElement: this.registerSharedElement,
            onRegisterSharedElement: this.onRegisterSharedElement,
            offRegisterSharedElement: this.offRegisterSharedElement
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
    registerSharedElement(url, name, element, measurements) {
        for(var i = 0; i < this.registrationHandlers.length; i++) {
            this.registrationHandlers[i](url, name, element, measurements);
        }
    }
    onRegisterSharedElement(registrationHandler) {
        this.registrationHandlers.push(registrationHandler);
    }
    offRegisterSharedElement(registrationHandler) {
        var index = this.registrationHandlers.indexOf(registrationHandler);
        if (index > -1)
            this.registrationHandlers.splice(index, 1);
    }
    clearScene(url) {
        this.setState(prevState => {
            var scenes = {...prevState.scenes};
            delete scenes[url];
            return {scenes};
        });
    }
    getScenes(){
        var {crumbs, nextCrumb} = this.getStateNavigator().stateContext;
        return crumbs.concat(nextCrumb).map(({state, data, url}) => (
            {state, data, url, scene: this.state.scenes[url], mount: url === nextCrumb.url}
        ));
    }
    getSceneData(data, url, prevState) {
        var scene = (prevState || this.state.scenes)[url];
        return {...data, ...(scene && scene.data)};
    }
    getStyle(styleProp, {state, data, url}, strip = false) {
        var style = typeof styleProp === 'function' ? styleProp(state, this.getSceneData(data, url)) : styleProp;
        var newStyle = {};
        for(var key in style) {
            newStyle[key] = (!strip || typeof style[key] === 'number') ? style[key] : style[key].val;
        }
        return newStyle;
    }
    render() {
        var {unmountedStyle, mountedStyle, crumbStyle, style, children} = this.props;
        return (this.getStateNavigator().stateContext.state &&
            <TransitionMotion
                willEnter={({data: sceneContext}) => this.getStyle(unmountedStyle, sceneContext, true)}
                willLeave={({data: sceneContext}) => this.getStyle(unmountedStyle, sceneContext)}
                didLeave={({data: sceneContext}) => {this.clearScene(sceneContext.url)}}
                styles={this.getScenes().map(({mount, ...sceneContext}) => ({
                    key: sceneContext.url,
                    data: sceneContext,
                    style: this.getStyle(mount ? mountedStyle : crumbStyle, sceneContext)
                }))}>
                {tweenStyles => (
                    <View style={style}>
                        {tweenStyles.map(({key, data: {scene, state, data, url}, style}) => (
                            children(style, scene && scene.element, key, state, this.getSceneData(data, url))
                        ))}
                    </View>
                )}
            </TransitionMotion>
        );
    }
}

export default NavigationMotion;
