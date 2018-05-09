import { State } from 'navigation';
import { NavigationContext, AsyncStateNavigator } from 'navigation-react';
import * as React from 'react';
type SceneState = { context: { oldState: State, state: State, data: any, asyncData: any, nextState: State, nextData: any, stateNavigator: AsyncStateNavigator } };

class Scene extends React.Component<{ stateNavigator: AsyncStateNavigator }, SceneState> {
    constructor(props) {
        super(props);
        this.state = Scene.createContext(this.props.stateNavigator);
    }
    static getDerivedStateFromProps({ stateNavigator }, { context }) {
        if (stateNavigator.stateContext.crumbs.length !== context.stateNavigator.stateContext.crumbs.length)
            return null;
        return Scene.createContext(stateNavigator);
    }
    static createContext(stateNavigator: AsyncStateNavigator) {
        var { oldState, state, data, asyncData } = stateNavigator.stateContext;
        return { context: { oldState, state, data, asyncData, nextState: null, nextData: {}, stateNavigator } };        
    }
    shouldComponentUpdate({ stateNavigator }, { context }) {
        return stateNavigator.stateContext.crumbs.length === context.stateNavigator.stateContext.crumbs.length;
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
