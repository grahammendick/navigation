import React, { Component } from 'react';

class ComponentB extends Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 }
    }
    render() {
        var increment = (prev) => ({ count: prev.count + 1 });
        return (
            <div>
                <h1>{this.props.title}</h1>
                <h2>{this.state.count}</h2>
                <button onClick={() => this.setState(increment)} >Increment</button>
            </div>
        );
    }
}

export default ComponentB;
