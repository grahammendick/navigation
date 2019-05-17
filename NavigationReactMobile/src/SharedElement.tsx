import * as React from 'react';
import withStateNavigator from './withStateNavigator';
import SharedElementContext from './SharedElementContext';
import { SharedElementProps } from './Props';

class SharedElement extends React.Component<SharedElementProps, any> {
    private ref: HTMLElement;
    componentDidMount() {
        this.register();
    }
    componentDidUpdate(prevProps) {
        var {stateNavigator, sharedElementRegistry} = this.props;
        var scene = stateNavigator.stateContext.crumbs.length;
        sharedElementRegistry.unregisterSharedElement(scene, prevProps.name);
        this.register();
    }
    componentWillUnmount() {
        var {stateNavigator, sharedElementRegistry} = this.props;
        var scene = stateNavigator.stateContext.crumbs.length;
        sharedElementRegistry.unregisterSharedElement(scene, this.props.name);
    }
    register() {
        if (!this.ref) return;
        var {unshare, name, data, stateNavigator, sharedElementRegistry} = this.props;
        var scene = stateNavigator.stateContext.crumbs.length;
        if (!unshare)
            sharedElementRegistry.registerSharedElement(scene, name, this.ref, data);
        else
            sharedElementRegistry.unregisterSharedElement(scene, name, this.ref);
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