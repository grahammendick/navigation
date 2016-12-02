import React, {Component} from 'react';
import {Motion, TransitionMotion} from 'react-motion';
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
        this.setState((prevState, props) => {
            var {url, crumbs} = props.stateNavigator.stateContext;
            var scenes = {[url]: state.renderScene(data, asyncData)};
            for(var i = 0; i < crumbs.length; i++) {
                scenes[crumbs[i].url] = prevState.scenes[crumbs[i].url]; 
            }
            return {scenes};
        });
    }
    renderScene({key, data: {scene, state, data, mount}, style: transitionStyle}) {
        var {mountedStyle, crumbStyle, children} = this.props;
        var transitioning = transitionStyle.transitioning;
        delete transitionStyle.transitioning;
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
                willEnter={() => getStyle(unmountedStyle, state, data, 1, true)} 
                willLeave={() => getStyle(unmountedStyle, oldState, oldData, 1)}
                styles={sceneContexts.map(({state, data, url, mount}) => ({
                    key: url,
                    data: {scene: this.state.scenes[url], state, data, mount},
                    style: getStyle(mountedStyle, state, data, spring(0))
                }))}>
                {tweenStyles => <div>{tweenStyles.map((config) => this.renderScene(config))}</div>}
            </TransitionMotion>
        );
    }
}

function getStyle(styleProp, state, data, transitioning, strip) {
    var style = typeof styleProp === 'function' ? styleProp(state, data) : styleProp;
    var newStyle = {};
    for(var key in style)
        newStyle[key] = !strip || typeof style[key] === 'number' ? style[key] : style[key].val;
    if (transitioning)
        newStyle.transitioning = transitioning;
    return newStyle;
}

export default SceneNavigator;
