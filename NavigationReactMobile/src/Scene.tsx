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
    static getDerivedStateFromProps(props: SceneProps & {navigationEvent: NavigationEvent}) {
        var {crumb, navigationEvent} = props;
        var {state, crumbs} = navigationEvent.stateNavigator.stateContext;
        return (state && crumbs.length === crumb) ? {navigationEvent} : null;
    }
    shouldComponentUpdate(_nextProps, nextState) {
        return nextState.navigationEvent !== this.state.navigationEvent;
    }
    render() {
        var {navigationEvent} = this.state;
        var {crumb, navigationEvent: {stateNavigator}} = this.props;
        var {crumbs, nextCrumb} = stateNavigator.stateContext;
        var {state, data} = (crumb < crumbs.length) ? crumbs[crumb] : nextCrumb;
        return (
            <NavigationContext.Provider value={navigationEvent}>
                {navigationEvent && this.props.renderScene(state, data)}
            </NavigationContext.Provider>
        );
    }
}

export default withStateNavigator(Scene);
