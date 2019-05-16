import * as React from 'react';
import { SharedElementProps } from './Props';

class SharedElement extends React.Component<SharedElementProps, any> {
    private sharedElementRef: React.RefObject<HTMLElement>;
    constructor(props) {
        super(props);
        this.sharedElementRef = React.createRef(); 
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
        var {current} = this.sharedElementRef;
        var eventData = {bubbles: true, detail: {name, data, share}};
        if (current)
            current.dispatchEvent(new CustomEvent('share', eventData));
    }
    register() {
        var {unshare, name, data} = this.props;
        if (!unshare)
            this.share(name, data, true);
        else
            this.share(name)
    }
    render() {
        return React.cloneElement(this.props.children, {ref: this.sharedElementRef});
    }
}

export default SharedElement;
