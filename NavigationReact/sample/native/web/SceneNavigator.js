import {spring, Motion, TransitionMotion} from 'react-motion';
import React, {Component} from 'react';

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
    //TODO - hide react motion from user code - create spring wrapper (with better precision default)?
    //TODO - rename parent to something more obscure so no fear of user choosing same style prop
    renderScene({key, data: {scene, state, data, mount}, style: {parent,...parentStyle}}) {
        var {mountStyle, mountedStyle, children} = this.props;
        var style = getStyle(mount ? mountStyle : mountedStyle, state, data);
        return (
            <Motion key={key} style={parent ? parentStyle : style}>
                {(tweenStyle) => children(tweenStyle, scene, state, data)}
            </Motion>
        );
    }
    render() {
        var {oldState, state, data, url, crumbs} = this.props.stateNavigator.stateContext;
        var {unmountedStyle, mountStyle, unmountStyle} = this.props;
        var sceneContexts = crumbs.concat({state, data, url, mount: true});
        return (
            <TransitionMotion
                willEnter={() => ({...getStyle(unmountedStyle, state, data), parent: 1})} 
                willLeave={() => ({...getStyle(unmountStyle, state, data), parent: 1})}
                styles={sceneContexts.map(({state, data, url, mount}) => ({
                    key: url,
                    data: {scene: this.state.scenes[url], state, data, mount},
                    style: {...getStyle(mountStyle, state, data), parent: spring(0)}
                }))}>
                {tweenStyles => <div>{tweenStyles.map((config) => this.renderScene(config))}</div>}
            </TransitionMotion>
        );
    }
}

function getStyle(styleAccessor, state, data) {
    if (typeof styleAccessor === 'function')
        return styleAccessor(state, data);
    return styleAccessor;
}

export default SceneNavigator;
