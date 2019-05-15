import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SharedElementContext from './SharedElementContext';
import SharedElementRegistry from './SharedElementRegistry';
type SceneProxyProps = {crumb: number, app: React.ComponentClass<{crumb: number}>, sharedElementRegistry: SharedElementRegistry};

class SceneProxy extends React.Component<SceneProxyProps> {
    private sceneEl: React.RefObject<HTMLDivElement>;
    constructor(props) {
        super(props);
        this.share = this.share.bind(this);
        this.unshare = this.unshare.bind(this);
        this.sceneEl = React.createRef(); 
    }
    componentDidMount() {
        this.sceneEl.current.addEventListener("share", this.share);
        this.sceneEl.current.addEventListener("unshare", this.unshare);
        var {crumb, app: App} = this.props;
        ReactDOM.render(<App crumb={crumb} />, this.sceneEl.current);
    }
    componentWillUnmount() {
        this.sceneEl.current.removeEventListener("share", this.share);
        this.sceneEl.current.removeEventListener("unshare", this.unshare);
        ReactDOM.unmountComponentAtNode(this.sceneEl.current);
    }
    share(e) {
        var {target, detail: {name, data}} = e;
        var {crumb, sharedElementRegistry} = this.props;
        sharedElementRegistry.registerSharedElement(crumb, name, target, data);
    }
    unshare(e) {
        var {detail: {name}} = e;
        var {crumb, sharedElementRegistry} = this.props;
        sharedElementRegistry.unregisterSharedElement(crumb, name);
    }
    render() {
        return (
            <div ref={this.sceneEl} />
        );
    }
}

export default props => (
    <SharedElementContext.Consumer>
        {(sharedElementRegistry) => (
            <SceneProxy {...props} sharedElementRegistry={sharedElementRegistry} />
        )}
    </SharedElementContext.Consumer>
);
