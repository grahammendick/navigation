import React, { ReactNode } from 'react';
import { requireNativeComponent, Platform, StyleSheet } from 'react-native';
import { StateNavigator, StateContext, State, Crumb } from 'navigation';
import { NavigationContext, NavigationEvent } from 'navigation-react';
import BackButton from './BackButton';
type SceneProps = { crumb: number, sceneKey: string, renderScene: (state: State, data: any) => ReactNode, crumbStyle: any, unmountStyle: any, hidesTabBar: any, title: (state: State, data: any) => string, popped: (key: string) => void, navigationEvent: NavigationEvent };
type SceneState = { navigationEvent: NavigationEvent };

class Scene extends React.Component<SceneProps, SceneState> {
    constructor(props) {
        super(props);
        this.state = {navigationEvent: null};
        this.handleBack = this.handleBack.bind(this);
        this.onBeforeNavigate = this.onBeforeNavigate.bind(this);
        this.peekNavigate = this.peekNavigate.bind(this);
    }
    static defaultProps = {
        title: (state: State) => state.title,
        renderScene: (state: State, data: any) => state.renderScene(data)
    }
    componentDidMount() {
        var {stateNavigator} = this.props.navigationEvent;
        stateNavigator.onBeforeNavigate(this.onBeforeNavigate);
        if (this.fluentPeekable()) setTimeout(this.peekNavigate);
    }
    static getDerivedStateFromProps(props: SceneProps, {navigationEvent: prevNavigationEvent}: SceneState) {
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
    shouldComponentUpdate(_nextProps, {navigationEvent}: SceneState) {
        return navigationEvent !== this.state.navigationEvent || this.fluentPeekable();
    }
    componentDidUpdate() {
        if (this.fluentPeekable()) setTimeout(this.peekNavigate);
    }
    componentWillUnmount() {
        var {stateNavigator} = this.props.navigationEvent;
        stateNavigator.offBeforeNavigate(this.onBeforeNavigate);
    }
    fluentPeekable() {
        var {navigationEvent, crumb} = this.props;
        var {crumbs} = navigationEvent.stateNavigator.stateContext;
        return Platform.OS === 'ios' && !this.state.navigationEvent && crumb === crumbs.length -1;
    }
    handleBack() {
        var {navigationEvent} = this.state;
        if (navigationEvent && navigationEvent.stateNavigator.canNavigateBack(1)) {
            navigationEvent.stateNavigator.navigateBack(1);
            return true;
        }
        return false;
    }
    onBeforeNavigate(_state, _data, url: string) {
        var {crumb, navigationEvent} = this.props;
        if (url.split('crumb=').length - 1 !== crumb || Platform.OS !== 'ios')
            return true;
        var {crumbs} = navigationEvent.stateNavigator.stateContext;
        var changed = !this.state.navigationEvent && crumb < crumbs.length;
        if (!changed && crumb < crumbs.length) {
            var {state: latestState, data: latestData} = crumbs[crumb];
            var {state, data} = this.state.navigationEvent.stateNavigator.stateContext;
            changed = state !== latestState || Object.keys(data).length !== Object.keys(latestData).length;
            for(var key in data) {
                changed = changed || data[key] !== latestData[key];
            }
        }
        if (changed) this.peekNavigate();
        return true;
    }
    peekNavigate() {
        var {crumb, navigationEvent} = this.props;
        var {crumbs, nextCrumb} = navigationEvent.stateNavigator.stateContext;
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
    static createStateContext(crumbs: Crumb[], nextCrumb: Crumb, crumb: number) {
        var stateContext = new StateContext();
        var {state, data, url, title} = crumbs[crumb];
        stateContext['peek'] = true;
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
    getAnimation() {
        var {crumb, navigationEvent: {stateNavigator}, unmountStyle, crumbStyle, hidesTabBar} = this.props;
        var {crumbs, nextCrumb} = stateNavigator.stateContext;
        var {state, data} = crumbs[crumb] || nextCrumb;
        var currentCrumbs = crumbs.slice(0, crumb);
        if (crumb > 0) {
            var {state: prevState, data: prevData} = crumbs[crumb - 1];
            var prevCrumbs = crumbs.slice(0, crumb - 1);
            var enterAnim = crumbStyle(true, prevState, prevData, prevCrumbs, state, data);
        }
        var exitAnim = unmountStyle(false, state, data, currentCrumbs);
        var hidesTabBar = hidesTabBar(state, data, currentCrumbs);
        return {enterAnim, exitAnim, hidesTabBar};
    }
    render() {
        var {navigationEvent} = this.state;
        var {crumb, title, sceneKey, popped, navigationEvent: {stateNavigator}} = this.props;
        var {crumbs} = stateNavigator.stateContext;
        var {state, data} = navigationEvent ? navigationEvent.stateNavigator.stateContext : crumbs[crumb];
        return (
            <NVScene
                sceneKey={sceneKey}
                {...this.getAnimation()}
                title={title(state, data)}
                style={styles.scene}
                onPopped={() => popped(sceneKey)}>
                <BackButton onPress={this.handleBack} />
                <NavigationContext.Provider value={navigationEvent}>
                    {navigationEvent && this.props.renderScene(state, data)}
                </NavigationContext.Provider>
            </NVScene>
        );
    }
}

var  NVScene = requireNativeComponent<any>('NVScene', null);

const styles = StyleSheet.create({
    scene: {
        backgroundColor: '#fff',
        position: 'absolute',
        top: 0, right: 0,
        bottom: 0, left: 0,
    },
});

export default props => (
    <NavigationContext.Consumer>
        {(navigationEvent) => <Scene navigationEvent={navigationEvent} {...props} />}
    </NavigationContext.Consumer>
)
