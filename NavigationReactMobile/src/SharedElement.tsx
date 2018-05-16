import * as React from 'react';
import withStateNavigator from './withStateNavigator';
import SharedElementContext from './SharedElementContext';
import { SharedElementProps } from './Props';

class SharedElement extends React.Component<SharedElementProps, any> {
    private ref: HTMLElement;
    private scene: number;
    constructor(props) {
        super(props);
        this.scene = this.props.stateNavigator.stateContext.crumbs.length;
        this.register = this.register.bind(this);
    }
    componentDidMount() {
        this.register();
    }
    componentDidUpdate(prevProps) {
        this.props.sharedElementRegistry.unregisterSharedElement(this.scene, prevProps.name);
        this.register();
    }
    componentWillUnmount() {
        this.props.sharedElementRegistry.unregisterSharedElement(this.scene, this.props.name);
    }
    register() {
        var {crumbs, oldUrl} = this.props.stateNavigator.stateContext;
        if (this.scene === crumbs.length || (oldUrl && this.scene === oldUrl.split('crumb=').length - 1)) {
            var {unshare, name, data, sharedElementRegistry} = this.props;
            if (!unshare) {
                if (this.ref)
                    sharedElementRegistry.registerSharedElement(this.scene, name, this.ref, data);
            } else {
                sharedElementRegistry.unregisterSharedElement(this.scene, name);
            }
        }
    }
    render() {
        return React.cloneElement(this.props.children, {ref: el => this.ref = el});
    }
}

export default withStateNavigator(props => (
    <SharedElementContext.Consumer>
        {(sharedElementRegistry) => (
            <SharedElement {...props} sharedElementRegistry={sharedElementRegistry} />
        )}
    </SharedElementContext.Consumer>
));
