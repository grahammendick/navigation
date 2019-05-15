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
    share(name: string, data?: any, share = false) {
        var eventData = {bubbles: true, detail: {name, data, share}};
        this.ref.dispatchEvent(new CustomEvent('share', eventData));
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
