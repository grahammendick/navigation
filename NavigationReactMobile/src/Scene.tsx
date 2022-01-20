import * as React from 'react';
import { State } from 'navigation';
import { NavigationContext, NavigationEvent } from 'navigation-react';
import withStateNavigator from './withStateNavigator';
import { SceneProps } from './Props';
type SceneState = { navigationEvent: NavigationEvent };

class Scene extends React.Component<SceneProps & {navigationEvent: NavigationEvent}, SceneState> {
    constructor(props) {
        super(props);
        this.state = {navigationEvent: null};
    }
    static defaultProps = {
        renderScene: (state: State, data: any) => state.renderScene(data)
    }
    static getDerivedStateFromProps(props: SceneProps & {navigationEvent: NavigationEvent}, {navigationEvent: prevNavigationEvent}: SceneState) {
        var {crumb, navigationEvent} = props;
        var {state, oldState, oldUrl, crumbs} = navigationEvent.stateNavigator.stateContext;
        if (!state || crumbs.length !== crumb)
            return null;
        if (!oldUrl || !prevNavigationEvent)
            return {navigationEvent};
        var {crumbs: oldCrumbs} = navigationEvent.stateNavigator.parseLink(oldUrl);
        var replace = oldCrumbs.length === crumb && oldState !== state;
        return !replace ? {navigationEvent} : null;
    }
    shouldComponentUpdate({crumb, rest, navigationEvent: {stateNavigator}}, nextState) {
        var {crumbs} = stateNavigator.stateContext;
        var freezableOrCurrent = rest && (!!React.Suspense || crumbs.length === crumb);
        return freezableOrCurrent || nextState.navigationEvent !== this.state.navigationEvent;
    }
    render() {
        var {navigationEvent} = this.state;
        var {crumb, navigationEvent: {stateNavigator}} = this.props;
        var {crumbs} = stateNavigator.stateContext;
        var stateContext = navigationEvent?.stateNavigator?.stateContext;
        var {state, data} = stateContext || crumbs[crumb];
        return (
            <NavigationContext.Provider value={navigationEvent}>
                {navigationEvent && this.props.renderScene(state, data)}
            </NavigationContext.Provider>
        );
    }
}

export default withStateNavigator(Scene);
