import React, { Component } from 'react';

class SceneNavigator extends Component{
    componentDidMount() {
        this.props.stateNavigator.onNavigate(() => {
            this.forceUpdate();
        });
    }
    
    render() {
        var {stateContext: { state, data}} = this.props.stateNavigator;
        var {component: Component, props} = state.renderScene(data);
        return <Component {...props} />
    }
}

export default SceneNavigator;
