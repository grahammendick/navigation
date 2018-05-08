import * as React from 'react';
import { SceneProps } from './Props';

class Scene extends React.Component<SceneProps, any> {
    shouldComponentUpdate(props: SceneProps) {
        return props.index === props.crumbs;
    }
    render() {
        return this.props.children;
    }
}

export default Scene;
