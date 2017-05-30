import React from 'react';

class Scene extends React.Component{
    constructor(props, context) {
        super(props, context);
        this.url = props.stateNavigator.stateContext.url;
    }
    shouldComponentUpdate(props) {
        return this.url === this.props.stateNavigator.stateContext.url;
    }
    render() {
        return this.props.children;
    }
}

export default Scene;
