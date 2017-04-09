import * as React from 'react';

class SharedElement extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.register = this.register.bind(this);
    }
    static contextTypes = {
        registerSharedElement: React.PropTypes.func
    }
    register(name, component, children) {
        var {registerSharedElement} = this.context;
        if (component && this.component !== component) {
            this.component = component;
            registerSharedElement(name, component, children);
        }
    }
    render() {
        var {name, children} = this.props;
        return React.cloneElement(children, {ref: component => {this.register(name, component, children)}});
    }
}

export default SharedElement;


