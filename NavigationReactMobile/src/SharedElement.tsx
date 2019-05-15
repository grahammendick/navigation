import * as React from 'react';
import { SharedElementProps } from './Props';

class SharedElement extends React.Component<SharedElementProps, any> {
    private ref: HTMLElement;
    componentDidMount() {
        this.register();
    }
    componentDidUpdate(prevProps) {
        this.share(prevProps.name)
        this.register();
    }
    componentWillUnmount() {
        this.share(this.props.name)
    }
    share(name, data?, share = false) {
        var e = new CustomEvent('share', {bubbles: true, detail: {share, name, data}});
        this.ref.dispatchEvent(e);
    }
    register() {
        var {unshare, name, data} = this.props;
        if (!unshare) {
            if (this.ref)
                this.share(name, data, true);
        } else {
            this.share(name)
        }
    }
    render() {
        return React.cloneElement(this.props.children, {ref: el => this.ref = el});
    }
}

export default SharedElement;
