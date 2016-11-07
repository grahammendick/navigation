import ComponentB from './ComponentB.js';
import React, { Component } from 'react';

class ComponentA extends Component {
    render() {
        return <ComponentB title={this.props.title} />;
    }
}

export default ComponentA;