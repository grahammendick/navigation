import React, { ReactNode } from 'react';
import { requireNativeComponent, StyleSheet } from 'react-native';
import { StateNavigator, StateContext, State, Crumb } from 'navigation';
import { NavigationContext, NavigationEvent } from 'navigation-react';
import BackButton from './BackButton';
import SceneContext from './SceneContext';
import SceneStatus from './SceneStatus';
type SceneProps = { crumb: number, sceneKey: string, renderScene: (state: State, data: any) => ReactNode, title: (state: State, data: any) => string, popped: (key: string) => void, navigationEvent: NavigationEvent };
type SceneState = { navigationEvent: NavigationEvent, status: SceneStatus };

class Scene extends React.Component<SceneProps, SceneState> {
    constructor(props) {
        super(props);
        this.state = {navigationEvent: null, status: new SceneStatus()};
        this.handleBack = this.handleBack.bind(this);
        this.onWillAppear = this.onWillAppear.bind(this);
    }
    static defaultProps = {
        title: (state: State) => state.title,
        renderScene: (state: State, data: any) => state.renderScene(data)
    }
    static getDerivedStateFromProps(props: SceneProps, {navigationEvent: prevNavigationEvent, status: prevStatus}: SceneState) {
        var {crumb, navigationEvent} = props;
        var {state, oldState, oldUrl, crumbs} = navigationEvent.stateNavigator.stateContext;
        if (!state || crumbs.length !== crumb)
            return !prevStatus.topOfStack ? null : {status: new SceneStatus()};
        if (!oldUrl || !prevNavigationEvent)
            return {navigationEvent, status: new SceneStatus(true)};
        var {crumbs: oldCrumbs} = navigationEvent.stateNavigator.parseLink(oldUrl);
        var status = prevStatus.topOfStack ? prevStatus : new SceneStatus(true);
        var replace = oldCrumbs.length === crumb && oldState !== state;
        return !replace ? {navigationEvent, status} : {status: new SceneStatus()};
    }
    shouldComponentUpdate(_nextProps, {navigationEvent, status}: SceneState) {
        return navigationEvent !== this.state.navigationEvent || status !== this.state.status;
    }
    handleBack() {
        var {navigationEvent, status} = this.state;
        if (status.topOfStack && navigationEvent && navigationEvent.stateNavigator.canNavigateBack(1)) {
            navigationEvent.stateNavigator.navigateBack(1);
            return true;
        }
        return false;
    }
    onWillAppear() {
        var {crumb, navigationEvent} = this.props;
        var {crumbs, nextCrumb} = navigationEvent.stateNavigator.stateContext;
        var changed = !this.state.navigationEvent && crumb < crumbs.length;
        if (!changed && crumb < crumbs.length) {
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
        var {navigationEvent, status} = this.state;
        var {crumb, title, sceneKey, popped, navigationEvent: {stateNavigator}} = this.props;
        var {crumbs} = stateNavigator.stateContext;
        var {state, data} = navigationEvent ? navigationEvent.stateNavigator.stateContext : crumbs[crumb];
        return (
            <NVScene
                sceneKey={sceneKey}
                title={title(state, data)}
                style={styles.scene}
                onWillAppear={this.onWillAppear}
                onPopped={() => popped(sceneKey)}>
                <BackButton onPress={this.handleBack} />
                <NavigationContext.Provider value={navigationEvent}>
                    <SceneContext.Provider value={status}>
                        {navigationEvent && this.props.renderScene(state, data)}
                    </SceneContext.Provider>
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
