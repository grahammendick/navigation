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
    //TODO - rename parent to something more obscure so no fear of user choosing same style prop
    renderScene({key, data: {scene, state, data, mount}, style: {parent,...parentStyle}}) {
        var {mountedStyle, mountedBackStyle, children} = this.props;
        var style = getStyleAccessor(mount ? mountedStyle : mountedBackStyle)(state, data);
        return (
            <Motion key={key} style={parent ? parentStyle : style}>
                {(tweenStyle) => children(tweenStyle, scene, state, data)}
            </Motion>
        );
    }
    render() {
        var {oldState, state, data, url, crumbs} = this.props.stateNavigator.stateContext;
        var {mountedStyle, unmountedStyle} = this.props;
        var sceneContexts = crumbs.concat({state, data, url, mount: true});
        return (
            <TransitionMotion
                willEnter={() => ({...stripStyle(getStyleAccessor(unmountedStyle)(state, data)), parent: 1})} 
                willLeave={() => ({...getStyleAccessor(unmountedStyle)(state, data), parent: 1})}
                styles={sceneContexts.map(({state, data, url, mount}) => ({
                    key: url,
                    data: {scene: this.state.scenes[url], state, data, mount},
                    style: {...getStyleAccessor(mountedStyle)(state, data), parent: spring(0)}
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

function getStyleAccessor(styleProp) {
    return typeof styleProp === 'function' ? styleProp : () => styleProp;
}

export default SceneNavigator;
