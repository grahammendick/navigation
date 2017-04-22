import { StateNavigator } from 'navigation';
import * as React from 'react';
import { View } from 'react-native';

class SharedElement extends React.Component<any, any> {
    private ref: Element;
    context: {
        stateNavigator: StateNavigator,
        registerSharedElement: (url, name, ref, measurements, data) => void,
        unregisterSharedElement: (url, name) => void
    }
    constructor(props, context) {
        super(props, context);
        this.state = {url: this.getStateNavigator().stateContext.url};
        this.register = this.register.bind(this);
    }
    static contextTypes = {
        stateNavigator: React.PropTypes.object,
        registerSharedElement: React.PropTypes.func,
        unregisterSharedElement: React.PropTypes.func
    }
    private getStateNavigator(): StateNavigator {
        return this.props.stateNavigator || this.context.stateNavigator;
    }
    componentDidMount() {
        this.getStateNavigator().onNavigate(this.register);
    }
    componentWillUnmount() {
        this.getStateNavigator().offNavigate(this.register);
        this.context.unregisterSharedElement(this.state.url, this.props.name);
    }
    register() {
        var {url} = this.state;
        if (url === this.getStateNavigator().stateContext.url
            || url === this.getStateNavigator().stateContext.oldUrl) {
            var {unshare, name, data} = this.props;
            if (!unshare) {
                (this.ref as any).measure((ox, oy, w, h, x, y) => {
                    this.context.registerSharedElement(url, name, this.ref, {w, h, x, y}, data);
                });
            } else {
                this.context.unregisterSharedElement(url, name);
            }
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
