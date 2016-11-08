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
        var {state, url, crumbs} = this.props.stateNavigator.stateContext;
        var {startStyle, endStyle, style} = this.props;
        var scenes = crumbs.concat({state, url, show: true}).map((sceneContext, i) => {
            var {state, url, show} = sceneContext;
            var {component: Scene, props} = this.state.scenes[url];
            return (
                <Motion key={i} defaultStyle={state.startStyle || startStyle}
                    style={(state.endStyle || endStyle)(!!show)}>
                    {(interpolatingStyle) => 
                        <div style={(state.style || style)(interpolatingStyle, !!show)}>
                            <Scene {...props} />
                        </div>
                    }
                </Motion>
            );
        });
        return <div>{scenes}</div>;
    }
}

export default SceneNavigator;
