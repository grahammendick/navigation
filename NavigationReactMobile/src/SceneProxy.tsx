import * as React from 'react';
import * as ReactDOM from 'react-dom';

class SceneProxy extends React.Component<{crumb: number, app: React.ComponentClass<{crumb: number}>}> {
    private sceneEl: React.RefObject<HTMLDivElement>;
    constructor(props) {
        super(props);
        this.sceneEl = React.createRef(); 
    }
    componentDidMount() {
        var {crumb, app: App} = this.props;
        ReactDOM.render(<App crumb={crumb} />, this.sceneEl.current);
    }
    componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.sceneEl.current);
    }
    render() {
        return (
            <div ref={this.sceneEl} />
        );
    }
}

export default SceneProxy;
