import React, { Component } from 'react';

class ComponentB extends Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 }
    }
    render() {
        var increment = (prev) => ({ count: prev.count + 1 });
        var {title, stateNavigator} = this.props;
        return (
            <div>
                <h1>{title}</h1>
                <h2>{this.state.count}</h2>
                {stateNavigator.canNavigateBack(1) && <button onClick={(() => stateNavigator.navigateBack(1))} >Back</button>}
                <button onClick={() => this.setState(increment)} >Increment</button>
            </div>
        );
    }
}

export default ComponentB;
