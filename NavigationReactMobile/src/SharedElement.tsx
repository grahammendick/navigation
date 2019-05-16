import * as React from 'react';
import { SharedElementProps } from './Props';

class SharedElement extends React.Component<SharedElementProps, any> {
    private ref: React.RefObject<HTMLElement>;
    constructor(props) {
        super(props);
        this.ref = React.createRef(); 
    }
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
        var {current} = this.ref;
        var eventData = {bubbles: true, detail: {name, data, share}};
        if (current)
            current.dispatchEvent(new CustomEvent('share', eventData));
    }
    register() {
        var {unshare, name, data} = this.props;
        this.share(name, data, !unshare);
    }
    render() {
        return React.cloneElement(this.props.children, {ref: this.ref});
    }
}

export default SharedElement;
