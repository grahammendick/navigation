import {Motion} from 'react-motion';
import React, {Component} from 'react';

class SceneNavigator extends Component{
    constructor(props) {
        super(props);
        var {stateContext: {state, data, url}} = props.stateNavigator;
        this.state = {scenes: {[url]: state.renderScene(data)}};
    }
    componentDidMount() {
        var {stateNavigator} = this.props;
        stateNavigator.onNavigate(() => {
            this.setState((prevState) => {
                var {stateContext: {state, data, url, crumbs}} = stateNavigator;
                var scenes = {[url]: state.renderScene(data)};
                for(var i = 0; i < crumbs.length; i++) {
                    scenes[crumbs[i].url] = prevState.scenes[crumbs[i].url]; 
                }
                return {scenes};
            });
        });
    }
    render() {
        var {stateContext: {state, url, crumbs}} = this.props.stateNavigator;
        var {startStyle, endStyle, style} = this.props;
        var sceneContexts = crumbs.concat({state, url});
        var scenes = sceneContexts.map((sceneContext, i) => {
            var {component: Scene, props} = this.state.scenes[sceneContext.url];
            var last = sceneContexts.length === i + 1;
            return (
                <Motion key={sceneContext.url}
                    defaultStyle={getStyle(sceneContext.state.startStyle, startStyle)}
                    style={getStyle(sceneContext.state.endStyle, endStyle(last))}>
                    {(interpolatingStyle) => 
                        <div style={getStyle(sceneContext.state.style, style(interpolatingStyle, last))}>
                            <Scene {...props} />
                        </div>
                    }
                </Motion>
            );
        });
        return <div>{scenes}</div>;
    }
}

function getStyle(overrideStyle, style) {
    return overrideStyle ? overrideStyle(style) : style;
}

export default SceneNavigator;
