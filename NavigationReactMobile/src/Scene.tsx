import { State } from 'navigation';
import { NavigationContext, NavigationEvent } from 'navigation-react';
import * as React from 'react';
import { SceneProps } from './Props';
type SceneState = { context: NavigationEvent };

class Scene extends React.Component<SceneProps, SceneState> {
    constructor(props: SceneProps) {
        super(props);
        this.state = {context: props.navigationEvent};
    }
    static getDerivedStateFromProps({ navigationEvent }: SceneProps, { context }: SceneState) {
        if (navigationEvent.stateNavigator.stateContext.crumbs.length 
            !== context.stateNavigator.stateContext.crumbs.length)
            return null;
        return {context: navigationEvent};
    }
    shouldComponentUpdate({ navigationEvent }: SceneProps, { context }: SceneState) {
        return navigationEvent.stateNavigator.stateContext.crumbs.length
            === context.stateNavigator.stateContext.crumbs.length;
    }
    render() {
        return (
            <NavigationContext.Provider value={this.state.context}>
                {this.props.children}
            </NavigationContext.Provider>
        );
    }
}

export default Scene;
