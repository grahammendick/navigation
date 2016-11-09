import {Motion} from 'react-motion';
import React, {Component} from 'react';

class SceneNavigator extends Component{
    constructor(props) {
        super(props);
        var {state, data, url} = props.stateNavigator.stateContext;
        this.state = {scenes: {[url]: state.renderScene(data)}};
    }
    componentDidMount() {
        var {stateNavigator} = this.props;
        stateNavigator.onNavigate((oldState, state, data, asyncData) => {
            this.setState((prevState) => {
                var {url, crumbs} = stateNavigator.stateContext;
                var scenes = {[url]: state.renderScene(data, asyncData)};
                for(var i = 0; i < crumbs.length; i++) {
                    scenes[crumbs[i].url] = prevState.scenes[crumbs[i].url]; 
                }
                return {scenes};
            });
        });
    }
    render() {
        var {oldState, state, data, url, crumbs} = this.props.stateNavigator.stateContext;
        var {getDefaultStyle, getStyle, interpolateStyle} = this.props;
        var scenes = crumbs.concat({state, data, url, show: true})
            .map(({state, data, url, show}) =>
                <Motion key={url} defaultStyle={getDefaultStyle(!oldState, state, data)}
                    style={getStyle(!!show, state, data)}>
                    {(interpolatingStyle) => 
                        <div style={interpolateStyle(interpolatingStyle, !!show, state, data)}>
                            {this.state.scenes[url]}
                        </div>
                    }
                </Motion>);
        return <div>{scenes}</div>;
    }
}

export default SceneNavigator;
