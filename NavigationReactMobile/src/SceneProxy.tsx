import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SharedElementContext from './SharedElementContext';
import SharedElementRegistry from './SharedElementRegistry';
type SceneProxyProps = {crumb: number, app: React.ComponentClass<{crumb: number}>, children: React.ReactElement<any>};

class SceneProxy extends React.Component<SceneProxyProps & {sharedElementRegistry: SharedElementRegistry}> {
    private sceneRef: React.RefObject<HTMLDivElement>;
    constructor(props) {
        super(props);
        this.sceneRef = React.createRef(); 
        this.share = this.share.bind(this);
    }
    componentDidMount() {
        var {crumb, app: App} = this.props;
        this.sceneRef.current.addEventListener("share", this.share);
        ReactDOM.render(<App crumb={crumb} />, this.sceneRef.current);
    }
    componentWillUnmount() {
        this.sceneRef.current.removeEventListener("share", this.share);
        ReactDOM.unmountComponentAtNode(this.sceneRef.current);
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
        return React.cloneElement(this.props.children, {ref: this.sceneRef});
    }
}

export default (props: SceneProxyProps) => (
    <SharedElementContext.Consumer>
        {(sharedElementRegistry) => (
            <SceneProxy {...props} sharedElementRegistry={sharedElementRegistry} />
        )}
    </SharedElementContext.Consumer>
);
