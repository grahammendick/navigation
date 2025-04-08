'use client'
import React from 'react';
import withStateNavigator from './withStateNavigator.js';
import SharedElementContext from './SharedElementContext.js';
import { SharedElementProps } from './Props.js';

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
        this.ref.current['sharedElementData'] = this.props.data;
        this.ref.current.dataset.sharedElement = 'true';
        this.resizeObserver?.observe(this.ref.current);
    }
    componentDidUpdate(prevProps) {
        var {sharedElementRegistry} = this.props;
        this.ref.current['sharedElementData'] = this.props.data;
        this.ref.current.dataset.sharedElement = 'true';
        if (prevProps.unshare !== this.props.unshare
            || prevProps.name !== this.props.name
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
        if (this.ref.current) this.resizeObserver?.unobserve(this.ref.current);
    }
    onResize() {
        if (this.ref.current.offsetWidth && this.ref.current.offsetHeight) {
            this.register();
            this.resizeObserver.observe(this.ref.current);
        }
    }
    register() {
        var {unshare, name, stateNavigator, sharedElementRegistry} = this.props;
        var scene = stateNavigator.stateContext.url;
        if (!unshare && this.ref.current.offsetWidth && this.ref.current.offsetHeight)
            sharedElementRegistry.registerSharedElement(scene, name, this.ref.current);
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