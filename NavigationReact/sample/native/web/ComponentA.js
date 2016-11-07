import ComponentB from './ComponentB.js';
import React, { Component } from 'react';

class ComponentA extends Component {
    render() {
        var {title, stateNavigator} = this.props;
        return (
            <div>
                <ComponentB title={title} />
                <button onClick={(() => stateNavigator.navigate('second'))} >Next</button>
            </div>
        );
    }
}

export default ComponentA;