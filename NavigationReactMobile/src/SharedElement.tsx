import { StateNavigator } from 'navigation';
import * as React from 'react';
import withStateNavigator from './withStateNavigator';
import SharedElementContext from './SharedElementContext';
import { SharedElementProps } from './Props';

class SharedElement extends React.Component<SharedElementProps, any> {
    private ref: HTMLElement;
    private scene: number;
    context: {
        stateNavigator: StateNavigator,
    }
    constructor(props, context) {
        super(props, context);
        this.scene = this.getStateNavigator().stateContext.crumbs.length;
        this.register = this.register.bind(this);
    }
    static contextTypes = {
        stateNavigator: () => null,
    }
    private getStateNavigator(): StateNavigator {
        return this.props.stateNavigator || this.context.stateNavigator;
    }
    componentDidMount() {
        this.register();
    }
    componentDidUpdate(prevProps) {
        this.props.unregisterSharedElement(this.scene, prevProps.name);
        this.register();
    }
    componentWillUnmount() {
        this.props.unregisterSharedElement(this.scene, this.props.name);
    }
    register() {
        var {crumbs, oldUrl} = this.getStateNavigator().stateContext;
        if (this.scene === crumbs.length || (oldUrl && this.scene === oldUrl.split('crumb=').length - 1)) {
            var {unshare, name, data} = this.props;
            if (!unshare) {
                if (this.ref)
                    this.props.registerSharedElement(this.scene, name, this.ref, data);
            } else {
                this.props.unregisterSharedElement(this.scene, name);
            }
        }
    }
    render() {
        return React.cloneElement(this.props.children, {ref: el => this.ref = el});
    }
}

export default withStateNavigator(props => (
    <SharedElementContext.Consumer>
        {({ registerSharedElement, unregisterSharedElement }) => (
            <SharedElement {...props}
                registerSharedElement={registerSharedElement}
                unregisterSharedElement={unregisterSharedElement} />
        )}
    </SharedElementContext.Consumer>
));
