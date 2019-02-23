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
        var {crumbs, nextCrumb} = navigationEvent.stateNavigator.stateContext;
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
                var tempNavigator = new StateNavigator(stateNavigator, stateNavigator.historyManager);
                tempNavigator.stateContext = Scene.createStateContext(crumbs, nextCrumb, crumb);
                tempNavigator.configure = stateNavigator.configure;
                tempNavigator.onBeforeNavigate = stateNavigator.onBeforeNavigate;
                tempNavigator.offBeforeNavigate = stateNavigator.offBeforeNavigate;
                tempNavigator.onNavigate = stateNavigator.onNavigate;
                tempNavigator.offNavigate = stateNavigator.offNavigate;
                tempNavigator.navigateLink = stateNavigator.navigateLink.bind(stateNavigator);
                var {oldState, state, data, asyncData} = tempNavigator.stateContext;
                this.setState({navigationEvent: {oldState, state, data, asyncData, stateNavigator: tempNavigator, nextState: undefined, nextData: undefined}});
            }
        }
    }
    static createStateContext(crumbs: Crumb[], nextCrumb: Crumb, crumb: number) {
        var stateContext = new StateContext();
        var {state, data, url, title} = crumbs[crumb];
        stateContext.state = state;
        stateContext.data = data;
        stateContext.url = url;
        stateContext.title = title;
        stateContext.crumbs = crumbs.slice(0, crumb);
        stateContext.nextCrumb = crumbs[crumb];
        var {state, data, url} = nextCrumb;
        stateContext.oldState = state;
        stateContext.oldData = data;
        stateContext.oldUrl = url;
        if (crumb > 1) {
            var {state, data, url} = crumbs[crumb - 1];
            stateContext.previousState = state;
            stateContext.previousData = data;
            stateContext.previousUrl = url;
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
