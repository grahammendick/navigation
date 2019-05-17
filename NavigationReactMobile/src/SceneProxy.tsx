import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Scene from './Scene';
import SharedElementRegistry from './SharedElementRegistry';
import withSharedElementRegistry from './withSharedElementRegistry';
type SceneProxyProps = {crumb: number, app: React.ComponentType<{crumb: number}>, rootPerScene: boolean};

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
        var {crumb, app: App, rootPerScene} = this.props;
        this.ref.current.addEventListener('share', this.share);
        if (rootPerScene)
            ReactDOM.render(<App crumb={crumb} />, this.ref.current);
    }
    componentWillUnmount() {
        var {rootPerScene} = this.props;
        this.ref.current.removeEventListener('share', this.share);
        if (rootPerScene)
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
        var {crumb, app: App, rootPerScene} = this.props;
        return <div ref={this.ref} >{!rootPerScene && <App crumb={crumb} />}</div>;
    }
}

export default withSharedElementRegistry(SceneProxy);
