import { StateNavigator } from 'navigation';
import * as React from 'react';
import { Motion, TransitionMotion } from 'react-motion';
import spring from './spring.js'

class NavigationMotion extends React.Component {
    onNavigate(oldState, state, data, asyncData) {
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
        this.onNavigate = this.onNavigate.bind(this);
        this.state = {scenes: {}};
    }
    getStateNavigator(){
        return this.props.stateNavigator || this.context.stateNavigator;
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
    calculateStyle(scene, mount, state, data) {
        var {mountedStyle, crumbStyle} = this.props;
        var style = (scene && scene.style) || (mount ? mountedStyle : crumbStyle);
        return getStyle(style, state, data);
    }
    render() {
        var {oldState, oldData, state, data, crumbs, nextCrumb} = this.getStateNavigator().stateContext;
        var {unmountedStyle, style, children} = this.props;
        var sceneContexts = crumbs.concat(nextCrumb);
        return (state &&
            <TransitionMotion
                willEnter={() => getStyle(unmountedStyle, state, data, true)} 
                willLeave={() => getStyle(unmountedStyle, oldState, oldData)}
                styles={sceneContexts.map(({state, data, url}) => ({
                    key: url,
                    data: {scene: this.state.scenes[url], state, data},
                    style: this.calculateStyle(this.state.scenes[url], url === nextCrumb.url, state, data)
                }))}>
                {tweenStyles => (
                    <div style={style}>
                        {tweenStyles.map(({key, data: {scene, state, data}, style: tweenStyle}) => (
                            children(tweenStyle, scene && scene.element, key, state, data)
                        ))}
                    </div>
                )}
            </TransitionMotion>
        );
    }
}

function getStyle(styleProp, state, data, strip) {
    var style = typeof styleProp === 'function' ? styleProp(state, data) : styleProp;
    var newStyle = {};
    for(var key in style) {
        newStyle[key] = (!strip || typeof style[key] === 'number') ? style[key] : style[key].val;
    }
    return newStyle;
}

NavigationMotion.contextTypes = {
    stateNavigator: React.PropTypes.object
}

export default NavigationMotion;
