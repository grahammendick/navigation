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
        var scenes = crumbs.concat({state, url, show: true}).map((sceneContext) => {
            var {component: Scene, props} = this.state.scenes[sceneContext.url];
            var {startStyle: stateStartStyle, endStyle: stateEndStyle, style: stateStyle} = sceneContext.state;
            return (
                <Motion key={sceneContext.url}
                    defaultStyle={getStyle(stateStartStyle, startStyle)}
                    style={getStyle(stateEndStyle, endStyle(!!sceneContext.show))}>
                    {(interpolatingStyle) => 
                        <div style={getStyle(stateStyle, style(interpolatingStyle, !!sceneContext.show))}>
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
