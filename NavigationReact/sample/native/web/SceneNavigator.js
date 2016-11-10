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
        var {getUnmountedStyle, getMountStyle, getMountedStyle, interpolateStyle} = this.props;
        var scenes = crumbs.concat({state, data, url, mount: true})
            .map(({state, data, url, mount}) =>
                <Motion key={url} defaultStyle={getUnmountedStyle(state, data)}
                    style={(mount ? getMountStyle : getMountedStyle)(state, data)}>
                    {(interpolatingStyle) => 
                        <div style={interpolateStyle(interpolatingStyle)}>
                            {this.state.scenes[url]}
                        </div>
                    }
                </Motion>);
        return <div>{scenes}</div>;
    }
}

export default SceneNavigator;
