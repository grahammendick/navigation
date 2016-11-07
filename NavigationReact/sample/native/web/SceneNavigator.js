import React, { Component } from 'react';

class SceneNavigator extends Component{
    componentDidMount() {
        this.props.stateNavigator.onNavigate(() => {
            this.forceUpdate();
        });
    }
    
    render() {
        var { stateContext: { state, data}} = this.props.stateNavigator;
        return state.renderScene(data);
    }
}

export default SceneNavigator;
