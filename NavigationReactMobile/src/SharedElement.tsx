import { StateNavigator } from 'navigation';
import * as React from 'react';

class SharedElement extends React.Component<any, any> {
    private ref: Element;
    private scene: number;
    context: {
        stateNavigator: StateNavigator,
        registerSharedElement: (url, name, ref, data) => void,
        unregisterSharedElement: (url, name) => void
    }
    constructor(props, context) {
        super(props, context);
        this.scene = this.getStateNavigator().stateContext.crumbs.length;
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
    componentDidUpdate(prevProps) {
        this.context.unregisterSharedElement(this.scene, prevProps.name);
        this.register();
    }
    componentWillUnmount() {
        this.context.unregisterSharedElement(this.scene, this.props.name);
    }
    register() {
        var {crumbs, oldUrl} = this.getStateNavigator().stateContext;
        if (this.scene === crumbs.length || (oldUrl && this.scene === oldUrl.split('crumb=').length - 1)) {
            var {unshare, name, data} = this.props;
            if (!unshare) {
                if (this.ref)
                    this.context.registerSharedElement(this.scene, name, this.ref, data);
            } else {
                this.context.unregisterSharedElement(this.scene, name);
            }
        }
    }
    render() {
        return React.cloneElement((this.props.children as any), {ref: el => this.ref = el});
    }
}

export default SharedElement;
