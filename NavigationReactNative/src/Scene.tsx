import React, { ReactNode } from 'react';
import { requireNativeComponent, BackHandler, NativeEventEmitter, NativeModules, EmitterSubscription, StyleSheet } from 'react-native';
import { StateNavigator, StateContext, State, Crumb } from 'navigation';
import { NavigationContext, NavigationEvent } from 'navigation-react';
type SceneProps = { crumb?: number, tab?: number, renderScene: (state: State, data: any) => ReactNode, navigationEvent: NavigationEvent };
type SceneState = { navigationEvent: NavigationEvent };

class Scene extends React.Component<SceneProps, SceneState> {
    private peekNavigateSubscription: EmitterSubscription;
    constructor(props) {
        super(props);
        this.state = {navigationEvent: null};
        this.handleBack = this.handleBack.bind(this);
        this.peekNavigate = this.peekNavigate.bind(this);
    }
    static defaultProps = {
        crumb: 0,
        tab: 0,
        renderScene: (state: State, data: any) => state.renderScene(data)
    }
    static getDerivedStateFromProps(props: SceneProps) {
        var {crumb, navigationEvent} = props;
        var {state, crumbs} = navigationEvent.stateNavigator.stateContext;
        return (state && crumbs.length === crumb) ? {navigationEvent} : null;
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBack);
        var navigationEmitter = new NativeEventEmitter(NativeModules.NavigationModule);
        this.peekNavigateSubscription = navigationEmitter.addListener('PeekNavigate', this.peekNavigate);
    }
    shouldComponentUpdate(_nextProps, nextState) {
        return nextState.navigationEvent !== this.state.navigationEvent;
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
        this.peekNavigateSubscription.remove();
    }
    handleBack() {
        var {navigationEvent} = this.state;
        if (navigationEvent && navigationEvent.stateNavigator.canNavigateBack(1)) {
            navigationEvent.stateNavigator.navigateBack(1);
            return true;
        }
        return false;
    }
    peekNavigate({crumb: targetCrumb, tab: targetTab}) {
        var {crumb, tab, navigationEvent} = this.props;
        var {crumbs, nextCrumb} = navigationEvent.stateNavigator.stateContext;
        if (targetCrumb === crumb && targetTab === tab && crumb < crumbs.length) {
            var changed = !this.state.navigationEvent;
            if (!changed) {
                var {state: latestState, data: latestData} = crumbs[crumb];
                var {state, data} = this.state.navigationEvent.stateNavigator.stateContext;
                changed = state !== latestState || Object.keys(data).length !== Object.keys(latestData).length;
                for(var key in data) {
                    changed = changed || data[key] !== latestData[key];
                }
            }
            if (changed) {
                var {stateNavigator} = navigationEvent;
                var peekNavigator = new StateNavigator(stateNavigator, stateNavigator.historyManager);
                peekNavigator.stateContext = Scene.createStateContext(crumbs, nextCrumb, crumb);
                peekNavigator.configure = stateNavigator.configure;
                peekNavigator.onBeforeNavigate = stateNavigator.onBeforeNavigate;
                peekNavigator.offBeforeNavigate = stateNavigator.offBeforeNavigate;
                peekNavigator.onNavigate = stateNavigator.onNavigate;
                peekNavigator.offNavigate = stateNavigator.offNavigate;
                peekNavigator.navigateLink = stateNavigator.navigateLink.bind(stateNavigator);
                var {oldState, state, data, asyncData} = peekNavigator.stateContext;
                this.setState({navigationEvent: {oldState, state, data, asyncData, stateNavigator: peekNavigator, nextState: undefined, nextData: undefined}});
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
        if (navigationEvent) {
            var {state, data, title} = navigationEvent.stateNavigator.stateContext;
            title = (state.getTitle && state.getTitle(data)) || title;
        }
        return (
            <NVScene style={StyleSheet.absoluteFill} title={title}>
                <NavigationContext.Provider value={navigationEvent}>
                    {navigationEvent && this.props.renderScene(state, data)}
                </NavigationContext.Provider>
            </NVScene>
        );
    }
}

var  NVScene = requireNativeComponent<any>('NVScene', null);

export default props => (
    <NavigationContext.Consumer>
        {(navigationEvent) => <Scene navigationEvent={navigationEvent} {...props} />}
    </NavigationContext.Consumer>
)
