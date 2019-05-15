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
        this.sceneEl = React.createRef(); 
    }
    componentDidMount() {
        this.sceneEl.current.addEventListener("share", this.share);
        var {crumb, app: App} = this.props;
        ReactDOM.render(<App crumb={crumb} />, this.sceneEl.current);
    }
    componentWillUnmount() {
        this.sceneEl.current.removeEventListener("share", this.share);
        ReactDOM.unmountComponentAtNode(this.sceneEl.current);
    }
    share(e) {
        var {target, detail: {name, data, share}} = e;
        var {crumb, sharedElementRegistry} = this.props;
        if (share)
            sharedElementRegistry.registerSharedElement(crumb, name, target, data);
        else
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
