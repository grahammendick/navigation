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
    componentDidMount() {
        this.getStateNavigator().onNavigate(this.register);
    }
    componentWillUnmount() {
        this.getStateNavigator().offNavigate(this.register);
    }
    register() {
        var {url} = this.state;
        if (url === this.getStateNavigator().stateContext.url) {
            this.ref.measure((ox, oy, w, h, x, y) => {
                var {name, data} = this.props;
                this.context.registerSharedElement(url, name, this.ref, {w, h, x, y}, data);
            });
        }
    }
    render() {
        return React.cloneElement(this.props.children, {
            onLayout: this.register,
            ref: comp => {this.ref = comp}
        });
    }
}

export default SharedElement;


