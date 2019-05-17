import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Scene from './Scene';
import SharedElementContext from './SharedElementContext';
import SharedElementRegistry from './SharedElementRegistry';
type SceneProxyProps = {crumb: number, app: React.ComponentType<{crumb: number}>, singleRoot: boolean};

class SceneProxy extends React.Component<SceneProxyProps & {sharedElementRegistry: SharedElementRegistry}> {
    private ref: React.RefObject<HTMLDivElement>;
    constructor(props) {
        super(props);
        this.ref = React.createRef(); 
        this.share = this.share.bind(this);
    }
    static defaultProps = {
        app: ({crumb}) => <Scene crumb={crumb} />
    }
    componentDidMount() {
        var {crumb, app: App, singleRoot} = this.props;
        this.ref.current.addEventListener("share", this.share);
        if (!singleRoot)
            ReactDOM.render(<App crumb={crumb} />, this.ref.current);
    }
    componentWillUnmount() {
        var {app: App, singleRoot} = this.props;
        this.ref.current.removeEventListener("share", this.share);
        if (!singleRoot)
            ReactDOM.unmountComponentAtNode(this.ref.current);
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
        var {crumb, app: App, singleRoot} = this.props;
        return <div ref={this.ref} >{singleRoot && <App crumb={crumb} />}</div>;
    }
}

export default (props: SceneProxyProps) => (
    <SharedElementContext.Consumer>
        {(sharedElementRegistry) => (
            <SceneProxy {...props} sharedElementRegistry={sharedElementRegistry} />
        )}
    </SharedElementContext.Consumer>
);
