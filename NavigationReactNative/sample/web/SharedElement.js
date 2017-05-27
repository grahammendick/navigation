import React from 'react';

class SharedElement extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {url: this.getStateNavigator().stateContext.url};
        this.register = this.register.bind(this);
    }
    getStateNavigator() {
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
                if (this.ref) {
                    var {scrollY, scrollX} = window;
                    var {top, left, width: w, height: h} = this.ref.getBoundingClientRect();
                    var measurements = {w, h, x: left + scrollX, y: top + scrollY};
                    this.context.registerSharedElement(url, name, this.ref, measurements, data);
                }
            } else {
                this.context.unregisterSharedElement(url, name);
            }
        }
    }
    render() {
        return React.cloneElement(this.props.children, {
            ref: comp => {
                this.ref = comp;
                this.register();
            }
        });
    }
}

SharedElement.contextTypes = {
    stateNavigator: () => {},
    registerSharedElement: () => {},
    unregisterSharedElement: () => {}
}

export default SharedElement;
