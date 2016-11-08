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
        var sceneContexts = crumbs.map((crumb) => ({state: crumb.state, url: crumb.url})).concat({state, url});
        var scenes = sceneContexts.map((sceneContext, i) => {
            var {component: Component, props} = this.state.scenes[sceneContext.url];
            var last = sceneContexts.length === i + 1;
            var defaultStyle = startStyle;
            if (sceneContext.state.startStyle)
                defaultStyle = sceneContext.state.startStyle(defaultStyle);
            return (
                <Motion key={sceneContext.url} defaultStyle={defaultStyle} style={endStyle(last)}>
                    {(interpolatingStyle) =>
                        <div style={style(interpolatingStyle, last)}>
                            <Component {...props} />
                        </div>
                    }
                </Motion>
            );
        });
        return <div>{scenes}</div>;
    }
}

export default SceneNavigator;
