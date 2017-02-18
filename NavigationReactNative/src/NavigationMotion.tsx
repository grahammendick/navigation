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
            for(var i = 0; i < crumbs.length; i++) {
                scenes[crumbs[i].url] = {
                    ...prevState.scenes[crumbs[i].url],
                    style: null
                };
            }
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
        return style => {
            this.setState((prevState) => {
                var scenes = {...prevState.scenes};
                if (scenes[url])
                    scenes[url].style = style; 
                return {scenes};
            }
        )};
    }
    transitionStyle(scene, url) {
        var {mountedStyle, crumbStyle} = this.props;
        var mount = url === this.getStateNavigator().stateContext.nextCrumb.url;
        return (scene && scene.style) || (mount ? mountedStyle : crumbStyle);
    }
    render() {
        var {state, data, crumbs, nextCrumb} = this.getStateNavigator().stateContext;
        var {unmountedStyle, style, children} = this.props;
        return (state &&
            <TransitionMotion
                willEnter={() => getStyle(unmountedStyle, state, data, true)} 
                willLeave={({data: {state, data}}) => getStyle(unmountedStyle, state, data)}
                styles={crumbs.concat(nextCrumb).map(({state, data, url}) => ({
                    key: url,
                    data: {scene: this.state.scenes[url], state, data},
                    style: getStyle(this.transitionStyle(this.state.scenes[url], url), state, data)
                }))}>
                {tweenStyles => (
                    <View style={style}>
                        {tweenStyles.map(({key, data: {scene, state, data}, style}) => (
                            children(style, scene && scene.element, key, state, data)
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
