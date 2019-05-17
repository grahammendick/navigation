import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SharedElementRegistry from './SharedElementRegistry';
import withSharedElementRegistry from './withSharedElementRegistry';
type SceneProxyProps = {crumb: number, app: React.ComponentType<{crumb: number}>};

class SceneProxy extends React.Component<SceneProxyProps & {sharedElementRegistry: SharedElementRegistry}> {
    private ref: React.RefObject<HTMLDivElement>;
    constructor(props) {
        super(props);
        this.ref = React.createRef(); 
        this.share = this.share.bind(this);
    }
    componentDidMount() {
        var {crumb, app: App} = this.props;
        this.ref.current.addEventListener('share', this.share);
        ReactDOM.render(<App crumb={crumb} />, this.ref.current);
    }
    componentWillUnmount() {
        this.ref.current.removeEventListener('share', this.share);
        ReactDOM.unmountComponentAtNode(this.ref.current);
    }
    share(e) {
        var {target, detail: {name, data, share}} = e;
        var {crumb, sharedElementRegistry} = this.props;
        if (share)
            sharedElementRegistry.registerSharedElement(crumb, name, target, data);
        else
            sharedElementRegistry.unregisterSharedElement(crumb, name, target);
    }
    render() {
        return <div ref={this.ref} />;
    }
}

export default withSharedElementRegistry(SceneProxy);
