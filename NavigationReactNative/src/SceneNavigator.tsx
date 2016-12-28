import { StateNavigator } from 'navigation';
import * as React from 'react';
import { Motion, TransitionMotion } from 'react-motion';
import { View } from 'react-native';
import spring from './spring.js'

class SceneNavigator extends React.Component<any, any> {
    private onNavigate = (oldState, state, data, asyncData) => {
        this.setState((prevState) => {
            var {url, crumbs} = this.getStateNavigator().stateContext;
            var scenes = {[url]: state.renderScene(data, asyncData)};
            for(var i = 0; i < crumbs.length; i++) {
                scenes[crumbs[i].url] = prevState.scenes[crumbs[i].url]; 
            }
            return {scenes};
        });
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
        var { startStateKey, startNavigationData } = this.props;
        if (startStateKey)
            stateNavigator.navigate(startStateKey, startNavigationData);
    }
    componentWillUnmount() {
        this.getStateNavigator().offNavigate(this.onNavigate);
    }
    renderScene({key, data: {scene, state, data, url, mount}, style: transitionStyle}) {
        var stateContext = this.getStateNavigator().stateContext;
        var {mountedStyle, crumbStyle, children} = this.props;
        transitionStyle = getStyle(transitionStyle);
        var transitioning = transitionStyle.transitioning;
        delete transitionStyle.transitioning;
        var style = getStyle(mount ? mountedStyle : crumbStyle, state, data);
        return (
            <Motion key={key} style={transitioning ? transitionStyle : style}>
                {(tweenStyle) => children(tweenStyle, scene, url === stateContext.url)}
            </Motion>
        );
    }
    render() {
        var {oldState, oldData, state, data, url, crumbs} = this.getStateNavigator().stateContext;
        if (!state)
            return null;
        var {unmountedStyle, mountedStyle, style} = this.props;
        var sceneContexts = (crumbs as [any]).concat({state, data, url, mount: true});
        return (
            <TransitionMotion
                willEnter={() => getStyle(unmountedStyle, state, data, 1, true)} 
                willLeave={() => getStyle(unmountedStyle, oldState, oldData, 1)}
                styles={sceneContexts.map(({state, data, url, mount}) => ({
                    key: url,
                    data: {scene: this.state.scenes[url], state, data, url, mount},
                    style: getStyle(mountedStyle, state, data, spring(0))
                }))}>
                {tweenStyles => (
                    <View style={style}>{tweenStyles.map((config) => this.renderScene(config))}</View>
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

export default SceneNavigator;
