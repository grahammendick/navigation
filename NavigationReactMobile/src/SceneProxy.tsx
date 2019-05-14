import * as React from 'react';

class SceneProxy extends React.Component<{crumb: number}> {
    private sceneEl: React.RefObject<HTMLDivElement>;
    constructor(props) {
        super(props);
        this.sceneEl = React.createRef(); 
    }
    componentDidMount() {        
    }
    render() {
        return (
            <div ref={this.sceneEl} />
        );
    }
}

export default SceneProxy;
