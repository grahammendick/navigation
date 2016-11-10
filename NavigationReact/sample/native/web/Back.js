import React, { Component } from 'react';

class Back extends Component {
    constructor(props) {
        super(props);
        this.onNavigate = () => this.forceUpdate();
    }
    componentDidMount() {
        this.props.stateNavigator.onNavigate(this.onNavigate);
    }
    componentWillUnmount() {
        this.props.stateNavigator.offNavigate(this.onNavigate);
    }
    render() {
        var {stateNavigator} = this.props;
        if (stateNavigator.canNavigateBack(1))
            return <button onClick={(() => stateNavigator.navigateBack(1))}>Back</button>;
        return null;
    }
}

export default Back;
