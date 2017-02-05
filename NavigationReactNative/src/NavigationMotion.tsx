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
    renderScene({key, data: {scene, state, data, url, mount}, style: {transitioning, ...transitionStyle}}) {
        var {mountedStyle, crumbStyle, children} = this.props;
        var style = scene.style || getStyle(mount ? mountedStyle : crumbStyle, state, data);
        return (
            <Motion key={key} style={transitioning ? transitionStyle : style}>
                {(tweenStyle) => children(tweenStyle, scene.element)}
            </Motion>
        );
    }
    render() {
        var {oldState, oldData, state, data, crumbs, nextCrumb} = this.getStateNavigator().stateContext;
        if (!state)
            return null;
        var {unmountedStyle, mountedStyle, style} = this.props;
        var sceneContexts = crumbs.concat(nextCrumb);
        return (
            <TransitionMotion
                willEnter={() => getStyle(unmountedStyle, state, data, 1, true)} 
                willLeave={() => getStyle(unmountedStyle, oldState, oldData, 1)}
                styles={sceneContexts.map(({state, data, url}) => ({
                    key: url,
                    data: {scene: this.state.scenes[url], state, data, url, mount: url === nextCrumb.url},
                    style: getStyle(this.state.scenes[url].style || mountedStyle, state, data, spring(0))
                }))}>
                {tweenStyles => (
                    <View style={style}>
                        {tweenStyles.map((config) => this.renderScene(config))}
                    </View>
                )}
            </TransitionMotion>
        );
    }
}

function getStyle(styleProp, state?, data?, transitioning?, strip?) {
    var style = typeof styleProp === 'function' ? styleProp(state, data) : styleProp;
    var newStyle: any = {};
    for(var key in style) {
        newStyle[key] = (!strip || typeof style[key] === 'number') ? style[key] : style[key].val;
    }
    if (transitioning)
        newStyle.transitioning = transitioning;
    return newStyle;
}

export default NavigationMotion;
