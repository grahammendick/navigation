import React, { Component } from 'react';

class SceneNavigator extends Component{
    constructor(props) {
        super(props);
        var {stateContext: {state, data, url}} = props.stateNavigator;
        this.state = {scenes: {
            [url]: state.renderScene(data)
        }};
    }
    componentDidMount() {
        this.props.stateNavigator.onNavigate(() => {
            this.setState((prevState) => {
                var {stateContext: {state, data, url, crumbs}} = this.props.stateNavigator;
                var scenes = {};
                for(var i = 0; i < crumbs.length; i++) {
                    scenes[crumbs[i].url] = prevState.scenes[crumbs[i].url]; 
                }
                scenes[url] = state.renderScene(data);
                return {scenes};
            });
        });
    }
    
    render() {
        var {stateContext: {url, crumbs}} = this.props.stateNavigator;
        var scenes = crumbs.map((crumb) => {
            var {component: Component, props} = this.state.scenes[crumb.url];
            return <Component key={crumb.url} {...props} />
        });
        var {component: Component, props} = this.state.scenes[url];
        scenes.push(<Component key={url} {...props} />);
        return (
            <div>{scenes}</div>
        );
    }
}

export default SceneNavigator;
