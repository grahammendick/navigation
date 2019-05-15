import * as React from 'react';
import { SharedElementProps } from './Props';

class SharedElement extends React.Component<SharedElementProps, any> {
    private ref: HTMLElement;
    componentDidMount() {
        this.register();
    }
    componentDidUpdate(prevProps) {
        this.unshare(prevProps.name)
        this.register();
    }
    componentWillUnmount() {
        this.unshare(this.props.name)
    }
    share(name, data) {
        var e = new CustomEvent('share', {bubbles: true, detail: {name, data}});
        this.ref.dispatchEvent(e);
    }
    unshare(name) {
        var e = new CustomEvent('unshare', {bubbles: true, detail: {name}});
        this.ref.dispatchEvent(e);
    }
    register() {
        var {unshare, name, data} = this.props;
        if (!unshare) {
            if (this.ref)
                this.share(name, data);
        } else {
            this.unshare(name)
        }
    }
    render() {
        return React.cloneElement(this.props.children, {ref: el => this.ref = el});
    }
}

export default SharedElement;
