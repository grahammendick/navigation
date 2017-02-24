import { StateNavigator } from 'navigation';
import * as React from 'react';
import { Motion, TransitionMotion } from 'react-motion';
import { View } from 'react-native';
import spring from './spring.js'

class NavigationMotion extends React.Component<any, any> {
    constructor(props, context) {
        super(props, context);
        this.state = {scenes: {}};
        this.onNavigate = this.onNavigate.bind(this);
    }
    static contextTypes = {
        stateNavigator: React.PropTypes.object
    }
    private getStateNavigator(): StateNavigator {
        return this.props.stateNavigator || (this.context as any).stateNavigator;
    }
    componentDidMount() {
        var stateNavigator = this.getStateNavigator();
        stateNavigator.onNavigate(this.onNavigate);
        var {startStateKey, startNavigationData} = this.props;
        if (startStateKey)
            stateNavigator.navigate(startStateKey, startNavigationData);
    }
    componentWillUnmount() {
        this.getStateNavigator().offNavigate(this.onNavigate);
    }
    onNavigate(oldState, state, data) {
        this.setState((prevState) => {
            var scenes = {...prevState.scenes};
            var {url, crumbs} = this.getStateNavigator().stateContext;
            var previousScene = crumbs.length > 0 ? prevState.scenes[crumbs[crumbs.length - 1].url] : null;
            var element = state.renderScene(data, this.moveScene(url), previousScene && previousScene.data);
            scenes[url] = {...scenes[url], element};
            return {scenes};
        });
    }
    moveScene(url) {
        return data => {
            this.setState((prevState) => {
                var scenes = {...prevState.scenes};
                scenes[url] = {...scenes[url], data};
                return {scenes};
            });
        };
    }
    clearScene(url) {
        this.setState((prevState) => {
            var scenes = {...prevState.scenes};
            delete scenes[url];
            return {scenes};
        });
    }
    getScenes(){
        var {crumbs, nextCrumb} = this.getStateNavigator().stateContext;
        return crumbs.concat(nextCrumb).map(({state, data, url}) => {
            var scene = this.state.scenes[url] || {};
            return {state, data, url, scene, sceneData: scene.data, mount: url === nextCrumb.url};
        });
    }
    getStyle(styleProp, {state, data, url}, strip = false) {
        var scene = this.state.scenes[url];
        var style = typeof styleProp === 'function' ? styleProp(state, data, scene && scene.data) : styleProp;
        var newStyle: any = {};
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
                didLeave={({data: sceneContext}) => { this.clearScene(sceneContext.url); }}
                styles={this.getScenes().map(({mount, ...sceneContext}) => ({
                    key: sceneContext.url,
                    data: sceneContext,
                    style: this.getStyle(mount ? mountedStyle : crumbStyle, sceneContext)
                }))}>
                {tweenStyles => (
                    <View style={style}>
                        {tweenStyles.map(({key, data: {scene, state, data, sceneData}, style}) => (
                            children(style, scene.element, key, state, data, sceneData)
                        ))}
                    </View>
                )}
            </TransitionMotion>
        );
    }
}

export default NavigationMotion;
