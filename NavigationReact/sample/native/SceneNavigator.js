import React, { Component } from 'react';

class SceneNavigator extends Component{
    componentDidMount() {
        this.props.stateNavigator.onNavigate(() => {
            this.forceUpdate();
        });
    }
    
    render() {
        return this.props.stateNavigator.stateContext.state
            .renderScene(this.props.stateNavigator.stateContext.data);
    }
}

export default SceneNavigator;
