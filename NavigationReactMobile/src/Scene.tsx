import * as React from 'react';
import { NavigationContext } from 'navigation-react';
import { SceneProps } from './Props';

class Scene extends React.Component<SceneProps> {
    shouldComponentUpdate({navigationEvent, stateNavigator}: SceneProps) {
        var index = navigationEvent.stateNavigator.stateContext.crumbs.length;
        return stateNavigator.stateContext.crumbs.length === index;
    }
    render() {
        return (
            <NavigationContext.Provider value={this.props.navigationEvent}>
                {this.props.children}
            </NavigationContext.Provider>
        );
    }
}

export default Scene;
