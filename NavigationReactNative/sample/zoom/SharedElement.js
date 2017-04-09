import * as React from 'react';
import { View } from 'react-native';

class SharedElement extends React.Component {
    static contextTypes = {
        registerSharedElement: React.PropTypes.func
    }
    render() {
        var {children} = this.props;
        var {registerSharedElement} = this.context;
        return React.cloneElement(children, {ref: component => {registerSharedElement(component, children)}});
    }
}

export default SharedElement;


