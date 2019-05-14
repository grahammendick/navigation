import * as React from 'react';

class SceneProxy extends React.Component<{crumb: number, mountScene: ({crumb: number, el: HTMLDivElement}) => {}}> {
    private sceneEl: React.RefObject<HTMLDivElement>;
    constructor(props) {
        super(props);
        this.sceneEl = React.createRef(); 
    }
    componentDidMount() {
        var {crumb, mountScene} = this.props;
        mountScene({crumb, el: this.sceneEl.current});
    }
    render() {
        return (
            <div ref={this.sceneEl} />
        );
    }
}

export default SceneProxy;
