import {Motion, TransitionMotion} from 'react-motion';
import React, {Component} from 'react';
import spring from './spring.js'

class SceneNavigator extends Component{
    constructor(props) {
        super(props);
        var {state, data, url} = props.stateNavigator.stateContext;
        this.state = {scenes: {[url]: state.renderScene(data)}};
        this.onNavigate = this.onNavigate.bind(this);
    }
    componentDidMount() {
        this.props.stateNavigator.onNavigate(this.onNavigate);
    }
    componentWillUnmount() {
        this.props.stateNavigator.offNavigate(this.onNavigate);
    }
    onNavigate(oldState, state, data, asyncData) {
        this.setState((prevState) => {
            var {url, crumbs} = this.props.stateNavigator.stateContext;
            var scenes = {[url]: state.renderScene(data, asyncData)};
            for(var i = 0; i < crumbs.length; i++) {
                scenes[crumbs[i].url] = prevState.scenes[crumbs[i].url]; 
            }
            return {scenes};
        });
    }
    renderScene({key, data: {scene, state, data, mount}, style: {transitioning,...transitionStyle}}) {
        var {mountedStyle, crumbStyle, children} = this.props;
        var style = getStyle(mount ? mountedStyle : crumbStyle, state, data);
        return (
            <Motion key={key} style={transitioning ? transitionStyle : style}>
                {(tweenStyle) => children(tweenStyle, scene, state, data)}
            </Motion>
        );
    }
    render() {
        var {oldState, oldData, state, data, url, crumbs} = this.props.stateNavigator.stateContext;
        var {unmountedStyle, mountedStyle} = this.props;
        var sceneContexts = crumbs.concat({state, data, url, mount: true});
        return (
            <TransitionMotion
                willEnter={() => ({...stripStyle(getStyle(unmountedStyle, state, data)), transitioning: 1})} 
                willLeave={() => ({...getStyle(unmountedStyle, oldState, oldData), transitioning: 1})}
                styles={sceneContexts.map(({state, data, url, mount}) => ({
                    key: url,
                    data: {scene: this.state.scenes[url], state, data, mount},
                    style: {...getStyle(mountedStyle, state, data), transitioning: spring(0)}
                }))}>
                {tweenStyles => <div>{tweenStyles.map((config) => this.renderScene(config))}</div>}
            </TransitionMotion>
        );
    }
}

function stripStyle(style) {
    var strippedStyle = {};
    for(var key in style)
        strippedStyle[key] = typeof style[key] === 'number' ? style[key] : style[key].val;
    return strippedStyle;
}

function getStyle(styleProp, state, data) {
    return typeof styleProp === 'function' ? styleProp(state, data) : styleProp;
}

export default SceneNavigator;
