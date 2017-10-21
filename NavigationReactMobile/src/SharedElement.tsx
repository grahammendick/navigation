import { StateNavigator } from 'navigation';
import * as React from 'react';

class SharedElement extends React.Component<any, any> {
    private ref: Element;
    private crumb: number;
    context: {
        stateNavigator: StateNavigator,
        registerSharedElement: (url, name, ref, data) => void,
        unregisterSharedElement: (url, name) => void
    }
    constructor(props, context) {
        super(props, context);
        this.crumb = this.getStateNavigator().stateContext.crumbs.length;
        this.register = this.register.bind(this);
    }
    static contextTypes = {
        stateNavigator: () => {},
        registerSharedElement: () => {},
        unregisterSharedElement: () => {}
    }
    private getStateNavigator(): StateNavigator {
        return this.props.stateNavigator || this.context.stateNavigator;
    }
    componentDidMount() {
        this.register();
    }
    componentWillUnmount() {
        this.context.unregisterSharedElement(this.crumb, this.props.name);
    }
    register() {
        var {crumbs, oldUrl} = this.getStateNavigator().stateContext;
        if (this.crumb === crumbs.length || this.crumb === oldUrl.split('crumb=').length - 1) {
            var {unshare, name, data} = this.props;
            if (!unshare) {
                if (this.ref)
                    this.context.registerSharedElement(this.crumb, name, this.ref, data);
            } else {
                this.context.unregisterSharedElement(this.crumb, name);
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

export default SharedElement;
