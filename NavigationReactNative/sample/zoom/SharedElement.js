import * as React from 'react';

class SharedElement extends React.Component {
    static contextTypes = {
        registerSharedElement: React.PropTypes.func
    }
    render() {
        var {key, children} = this.props;
        var {registerSharedElement} = this.context;
        return React.cloneElement(children, {ref: component => {registerSharedElement(key, component, children)}});
    }
}

export default SharedElement;


