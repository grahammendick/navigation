import React, { ReactNode } from 'react';
import { BackHandler, NativeEventEmitter, NativeModules, EmitterSubscription } from 'react-native';
import { StateNavigator, StateContext, State, Crumb } from 'navigation';
import { NavigationContext, NavigationEvent } from 'navigation-react';
type NavigationMotionProps = { crumb?: number, renderScene: (state: State, data: any) => ReactNode, navigationEvent: NavigationEvent };
type NavigationMotionState = { navigationEvent: NavigationEvent };

class Scene extends React.Component<NavigationMotionProps, NavigationMotionState> {
    private willNavigateSubscription: EmitterSubscription;
    constructor(props) {
        super(props);
        this.state = {navigationEvent: null};
        this.handleBack = this.handleBack.bind(this);
        this.willNavigate = this.willNavigate.bind(this);
    }
    static defaultProps = {
        crumb: 0,
        renderScene: (state, data) => state.renderScene(data)
    }
    static getDerivedStateFromProps(props: NavigationMotionProps) {
        var {crumb, navigationEvent} = props;
        var {state, crumbs} = navigationEvent.stateNavigator.stateContext;
        if (state && crumbs.length === crumb)
            return {navigationEvent};
        return null;
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBack);
        var navigationEmitter = new NativeEventEmitter(NativeModules.NavigationModule);
        this.willNavigateSubscription = navigationEmitter.addListener('WillNavigate', this.willNavigate);
    }
    shouldComponentUpdate(_nextProps, nextState) {
        return nextState.navigationEvent !== this.state.navigationEvent;
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
        this.willNavigateSubscription.remove();
    }
    handleBack() {
        var {navigationEvent} = this.state;
        if (navigationEvent && navigationEvent.stateNavigator.canNavigateBack(1)) {
            navigationEvent.stateNavigator.navigateBack(1);
            return true;
        }
        return false;
    }
    willNavigate({crumb: targetCrumb}) {
        var {crumb, navigationEvent} = this.props;
        var {crumbs} = navigationEvent.stateNavigator.stateContext;
        if (targetCrumb === crumb && crumb < crumbs.length) {
            var changed = !this.state.navigationEvent;
            if (!changed) {
                var {state: latestState, data: latestData} = crumbs[crumb];
                var {state, data} = this.state.navigationEvent.stateNavigator.stateContext;
                changed = state !== latestState || data.length !== latestData.length;
                for(var key in data) {
                    changed = changed || data[key] !== latestData[key];
                }
            }
            if (changed) {
                var {stateNavigator} = navigationEvent;
                var stackNavigator = new StateNavigator(stateNavigator, stateNavigator.historyManager);
                stackNavigator.stateContext = Scene.createStateContext(crumbs, crumb);
                stackNavigator.configure = stateNavigator.configure;
                stackNavigator.onBeforeNavigate = stateNavigator.onBeforeNavigate;
                stackNavigator.offBeforeNavigate = stateNavigator.offBeforeNavigate;
                stackNavigator.onNavigate = stateNavigator.onNavigate;
                stackNavigator.offNavigate = stateNavigator.offNavigate;
                stackNavigator.navigateLink = stateNavigator.navigateLink.bind(stateNavigator);
                var {oldState, state, data, asyncData} = stackNavigator.stateContext;
                this.setState({navigationEvent: {oldState, state, data, asyncData, stateNavigator: stackNavigator, nextState: undefined, nextData: undefined}});
            }
        }
    }
    static createStateContext(crumbs: Crumb[], crumb: number) {
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
        return stateContext;
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
