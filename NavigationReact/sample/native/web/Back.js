import React, { Component } from 'react';

class Back extends Component {
    componentDidMount() {
        this.props.stateNavigator.onNavigate(() => {
            this.forceUpdate();
        });
    }
    render() {
        var {stateNavigator} = this.props;
        if (stateNavigator.canNavigateBack(1))
            return <button onClick={(() => stateNavigator.navigateBack(1))}>Back</button>;
        return null;
    }
}

export default Back;
