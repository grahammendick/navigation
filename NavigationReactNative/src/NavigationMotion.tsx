import { StateNavigator } from 'navigation';
import * as React from 'react';
import { Motion, TransitionMotion } from 'react-motion';
import { View } from 'react-native';
import spring from './spring.js'

class NavigationMotion extends React.Component<any, any> {
    private onNavigate = (oldState, state, data, asyncData) => {
        this.setState((prevState) => {
            var {url, crumbs} = this.getStateNavigator().stateContext;
            var scenes = {[url]: {element: state.renderScene(data, this.moveScene(url), asyncData)}};
            for(var i = 0; i < crumbs.length; i++)
                scenes[crumbs[i].url] = prevState.scenes[crumbs[i].url];
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
    getSceneContexts(){
        var {crumbs, nextCrumb} = this.getStateNavigator().stateContext;
        return crumbs.concat(nextCrumb).map(({state, data, url}) => {
            var scene = this.state.scenes[url] || {};
            return { state, data, url, scene, sceneData: scene.data, mount: url === nextCrumb.url };
        });
    }
    render() {
        var {state, crumbs, nextCrumb} = this.getStateNavigator().stateContext;
        var {unmountedStyle, mountedStyle, crumbStyle, style, children} = this.props;
        return (state &&
            <TransitionMotion
                willEnter={({data: {state, data}}) => getStyle(unmountedStyle, state, data, true)}
                willLeave={({data: {state, data}}) => getStyle(unmountedStyle, state, data)}
                styles={this.getSceneContexts().map(({state, data, url, scene, sceneData, mount}) => ({
                    key: url,
                    data: {scene, state, data},
                    style: getStyle(mount ? mountedStyle : crumbStyle, state, sceneData || data)
                }))}>
                {tweenStyles => (
                    <View style={style}>
                        {tweenStyles.map(({key, data: {scene, state, data}, style}) => (
                            children(style, scene.element, key, state, data)
                        ))}
                    </View>
                )}
            </TransitionMotion>
        );
    }
}

function getStyle(styleProp, state, data, strip = false) {
    var style = typeof styleProp === 'function' ? styleProp(state, data) : styleProp;
    var newStyle: any = {};
    for(var key in style) {
        newStyle[key] = (!strip || typeof style[key] === 'number') ? style[key] : style[key].val;
    }
    return newStyle;
}

export default NavigationMotion;
