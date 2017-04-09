import * as React from 'react';
import { View } from 'react-native';

class SharedElement extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {url: this.getStateNavigator().stateContext.url};
        this.register = this.register.bind(this);
    }
    static contextTypes = {
        stateNavigator: React.PropTypes.object,
        registerSharedElement: React.PropTypes.func
    }
    getStateNavigator() {
        return this.props.stateNavigator || this.context.stateNavigator;
    }
    register() {
        this.component.measure((ox, oy, w, h, x, y) => {
            var {url} = this.state;
            var {name, children} = this.props;
            var {registerSharedElement} = this.context;
            registerSharedElement(url, name, children, {w, h, x, y});
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


