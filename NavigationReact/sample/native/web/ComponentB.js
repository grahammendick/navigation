import React, { Component } from 'react';

class ComponentB extends Component {
    constructor(props) {
        super(props);
        this.state = {count: 0}
    }
    render() {
        var {title, stateNavigator} = this.props;
        return (
            <div>
                <h1>{title}</h1>
                <h2>{this.state.count}</h2>
                <button onClick={() => this.setState((prev) => ({count: prev.count + 1}))}>Increment</button>
            </div>
        );
    }
}

export default ComponentB;
