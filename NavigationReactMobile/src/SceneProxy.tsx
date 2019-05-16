import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SharedElementContext from './SharedElementContext';
import SharedElementRegistry from './SharedElementRegistry';
type SceneProxyProps = {crumb: number, app: React.ComponentClass<{crumb: number}>, children: React.ReactElement<any>};

class SceneProxy extends React.Component<SceneProxyProps & {sharedElementRegistry: SharedElementRegistry}> {
    private sceneEl: React.RefObject<HTMLDivElement>;
    constructor(props) {
        super(props);
        this.share = this.share.bind(this);
        this.sceneEl = React.createRef(); 
    }
    componentDidMount() {
        var {crumb, app: App} = this.props;
        this.sceneEl.current.addEventListener("share", this.share);
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
        return React.cloneElement(this.props.children, {ref: this.sceneEl});
    }
}

export default (props: SceneProxyProps) => (
    <SharedElementContext.Consumer>
        {(sharedElementRegistry) => (
            <SceneProxy {...props} sharedElementRegistry={sharedElementRegistry} />
        )}
    </SharedElementContext.Consumer>
);
