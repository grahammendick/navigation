import { StateNavigator } from 'navigation';
import * as React from 'react';

class Scene extends React.Component<any, any> {
    private index: number;
    constructor(props, context) {
        super(props, context);
        this.index = context.stateNavigator.stateContext.crumbs.length;
    }
    static contextTypes = {
        stateNavigator: () => {}
    }
    shouldComponentUpdate(props) {
        return this.index === this.context.stateNavigator.stateContext.crumbs.length;
    }
    render() {
        return this.props.children;
    }
}

export default Scene;
