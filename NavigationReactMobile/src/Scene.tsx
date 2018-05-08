import * as React from 'react';

class Scene extends React.Component<any, any> {
    shouldComponentUpdate(props) {
        return props.crumbs === props.stateNavigator.stateContext.crumbs.length;
    }
    render() {
        return this.props.children;
    }
}

export default Scene;
