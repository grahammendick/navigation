import * as React from 'react';
import { View } from 'react-native';

class SharedElement extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.register = this.register.bind(this);
    }
    static contextTypes = {
        registerSharedElement: React.PropTypes.func
    }
    register() {
        this.component.measure((ox, oy, w, h, x, y) => {
            var {name, children} = this.props;
            var {registerSharedElement} = this.context;
            registerSharedElement(name, children, {w, h, x, y});
        });
    }
    render() {
        return React.cloneElement(this.props.children, {
            onLayout: this.register,
            ref: comp => {this.component = comp}
        });
    }
}

export default SharedElement;


