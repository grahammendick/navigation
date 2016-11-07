import ComponentB from './ComponentB.js';
import React, { Component } from 'react';

class ComponentA extends Component {
    render() {
        var {title, stateNavigator, next} = this.props;
        return (
            <div>
                <ComponentB title={title} stateNavigator={stateNavigator} />
                <button onClick={(() => stateNavigator.navigate(next))}>Next</button>
            </div>
        );
    }
}

export default ComponentA;