import React, { ReactNode } from 'react';
import { BackHandler } from 'react-native';
import { StateNavigator, StateContext, State, Crumb } from 'navigation';
import { NavigationContext, NavigationEvent } from 'navigation-react';
type NavigationMotionProps = { crumb?: number, renderScene: (state: State, data: any) => ReactNode, navigationEvent: NavigationEvent };
type NavigationMotionState = { navigationEvent: NavigationEvent };

class Scene extends React.Component<NavigationMotionProps, NavigationMotionState> {
    constructor(props) {
        super(props);
        this.state = {navigationEvent: null};
        this.handleBack = this.handleBack.bind(this);
    }
    static defaultProps = {
        crumb: 0,
        renderScene: (state, data) => state.renderScene(data)
    }
    static getDerivedStateFromProps(props: NavigationMotionProps, {navigationEvent: prevNavigationEvent}: NavigationMotionState) {
        var {crumb, navigationEvent} = props;
        var {state, crumbs} = navigationEvent.stateNavigator.stateContext;
        if (state && crumbs.length === crumb)
            return {navigationEvent};
        if (state && !prevNavigationEvent && crumb < crumbs.length) {
            var stackNavigationEvent = Scene.createNavigationEvent(navigationEvent, crumbs, crumb);
            return {navigationEvent: stackNavigationEvent};
        }
        return null;
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    }
    shouldComponentUpdate(props, state) {
        return state.navigationEvent === props.navigationEvent;
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBack); 
    }
    handleBack() {
        var {navigationEvent} = this.state;
        if (navigationEvent && navigationEvent.stateNavigator.canNavigateBack(1)) {
            navigationEvent.stateNavigator.navigateBack(1);
            return true;
        }
        return false;
    }
    willNavigate({crumb}) {
        if (this.props.crumb === crumb) {
            var {navigationEvent} = this.props;
            var {crumbs} = navigationEvent.stateNavigator.stateContext;
            var {nextCrumb} = this.state.navigationEvent.stateNavigator.stateContext;
            if (crumb < crumbs.length && crumbs[crumb].crumblessUrl !== nextCrumb.crumblessUrl) {
                var stackNavigationEvent = Scene.createNavigationEvent(navigationEvent, crumbs, crumb);
                this.setState({navigationEvent: stackNavigationEvent});
            }
        }
    }
    static createNavigationEvent(navigationEvent: NavigationEvent, crumbs: Crumb[], crumb: number): NavigationEvent {
        var {stateNavigator} = navigationEvent;
        var stackNavigator = new StateNavigator(stateNavigator, stateNavigator.historyManager);
        var stateContext = new StateContext();
        var {state, data, url, title} = crumbs[crumb];
        stateContext.state = state;
        stateContext.data = data;
        stateContext.url = url;
        stateContext.title = title;
        stateContext.crumbs = crumbs.slice(0, crumb);
        stateContext.nextCrumb = crumbs[crumb];
        if (crumb > 1) {
            var {state, data, url} = crumbs[crumb - 1];
            stateContext.previousState = stateContext.oldState = state;
            stateContext.previousData = stateContext.oldData = data;
            stateContext.previousUrl = stateContext.oldUrl = url;
        }
        stackNavigator.stateContext = stateContext;
        stackNavigator.configure = stateNavigator.configure;
        stackNavigator.onBeforeNavigate = stateNavigator.onBeforeNavigate;
        stackNavigator.offBeforeNavigate = stateNavigator.offBeforeNavigate;
        stackNavigator.onNavigate = stateNavigator.onNavigate;
        stackNavigator.offNavigate = stateNavigator.offNavigate;
        stackNavigator.navigateLink = stateNavigator.navigateLink.bind(stateNavigator);
        var {oldState, state, data, asyncData} = stackNavigator.stateContext;
        return {oldState, state, data, asyncData, stateNavigator: stackNavigator, nextState: undefined, nextData: undefined};
    }
    render() {
        var {navigationEvent} = this.state;
        if (!navigationEvent) return null;
        var {state, data} = navigationEvent.stateNavigator.stateContext;
        return (
            <NavigationContext.Provider value={navigationEvent}>
                {this.props.renderScene(state, data)}
            </NavigationContext.Provider>
        );
    }
}

export default props => (
    <NavigationContext.Consumer>
        {(navigationEvent) => <Scene navigationEvent={navigationEvent} {...props} />}
    </NavigationContext.Consumer>
)
