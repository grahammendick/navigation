import * as React from 'react';
import withStateNavigator from './withStateNavigator';
import SharedElementContext from './SharedElementContext';
import { SharedElementProps } from './Props';

class SharedElement extends React.Component<SharedElementProps, any> {
    private ref: React.RefObject<HTMLElement>;
    private resizeObserver: ResizeObserver;
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.onResize = this.onResize.bind(this);
        if (typeof ResizeObserver !== 'undefined') this.resizeObserver = new ResizeObserver(this.onResize);
    }
    componentDidMount() {
        this.register();
        this.resizeObserver?.observe(this.ref.current);
    }
    componentDidUpdate(prevProps) {
        var {sharedElementRegistry} = this.props;
        if (prevProps.unshare !== this.props.unshare
            || prevProps.name !== this.props.name
            || prevProps.data !== this.props.data
            || prevProps.stateNavigator !== this.props.stateNavigator) {
            var prevScene = prevProps.stateNavigator.stateContext.url;
            sharedElementRegistry.unregisterSharedElement(prevScene, prevProps.name);
            this.register();
        }
    }
    componentWillUnmount() {
        var {stateNavigator, sharedElementRegistry} = this.props;
        var scene = stateNavigator.stateContext.url;
        sharedElementRegistry.unregisterSharedElement(scene, this.props.name);
        this.resizeObserver?.unobserve(this.ref.current);
    }
    onResize() {
        this.register();
    }
    register() {
        var {unshare, name, data, stateNavigator, sharedElementRegistry} = this.props;
        var scene = stateNavigator.stateContext.url;
        if (!unshare && this.ref.current.offsetWidth && this.ref.current.offsetHeight)
            sharedElementRegistry.registerSharedElement(scene, name, this.ref.current, data);
        if (unshare)
            sharedElementRegistry.unregisterSharedElement(scene, name);
    }
    render() {
        return React.cloneElement(this.props.children, {ref: this.ref});
    }
}

export default withStateNavigator(props => (
    <SharedElementContext.Consumer>
        {(sharedElementRegistry) => (
            <SharedElement {...props} sharedElementRegistry={sharedElementRegistry} />
        )}
    </SharedElementContext.Consumer>
));