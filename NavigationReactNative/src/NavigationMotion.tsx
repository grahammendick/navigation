import { StateNavigator } from 'navigation';
import * as React from 'react';
import { Motion, TransitionMotion } from 'react-motion';
import { View } from 'react-native';
import spring from './spring.js'

class NavigationMotion extends React.Component<any, any> {
    private onNavigate = (oldState, state, data) => {
        this.setState((prevState) => {
            var scenes = {};
            var previousScene = null;
            var {url, crumbs} = this.getStateNavigator().stateContext;
            for(var i = 0; i < crumbs.length; i++)
                scenes[crumbs[i].url] = previousScene = prevState.scenes[crumbs[i].url];
            var element = state.renderScene(data, this.moveScene(url), previousScene && previousScene.data);
            scenes[url] = {...prevState.scenes[url], element};
            return {scenes};
        });
    }
    constructor(props, context) {
        super(props, context);
        this.state = {scenes: {}};
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
    moveScene(url) {
        return data => {
            this.setState((prevState) => {
                var scenes = {...prevState.scenes};
                if (scenes[url])
                    scenes[url].data = data; 
                return {scenes};
            }
        )};
    }
    getScenes(){
        var {crumbs, nextCrumb} = this.getStateNavigator().stateContext;
        return crumbs.concat(nextCrumb).map(({state, data, url}) => {
            var scene = this.state.scenes[url] || {};
            return {state, data, url, scene, sceneData: scene.data, mount: url === nextCrumb.url};
        });
    }
    render() {
        var {unmountedStyle, mountedStyle, crumbStyle, style, children} = this.props;
        return (this.getStateNavigator().stateContext.state &&
            <TransitionMotion
                willEnter={({data: sceneContext}) => getStyle(unmountedStyle, sceneContext, true)}
                willLeave={({data: sceneContext}) => getStyle(unmountedStyle, sceneContext)}
                styles={this.getScenes().map(({url, mount, ...sceneContext}) => ({
                    key: url,
                    data: sceneContext,
                    style: getStyle(mount ? mountedStyle : crumbStyle, sceneContext)
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

function getStyle(styleProp, {state, data, sceneData}, strip = false) {
    var style = typeof styleProp === 'function' ? styleProp(state, data, sceneData) : styleProp;
    var newStyle: any = {};
    for(var key in style) {
        newStyle[key] = (!strip || typeof style[key] === 'number') ? style[key] : style[key].val;
    }
    return newStyle;
}

export default NavigationMotion;
