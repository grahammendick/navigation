import React, { ReactNode } from 'react';
import { requireNativeComponent, StyleSheet, View } from 'react-native';
import { Crumb, State } from 'navigation';
import { NavigationContext, AsyncStateNavigator } from 'navigation-react';
import PopSync from './PopSync';
import Scene from './Scene';
type NavigationStackProps = {stateNavigator: AsyncStateNavigator, title: (state: State, data: any) => string, crumbStyle: any, unmountStyle: any, hidesTabBar: any, sharedElement: any, renderScene: (state: State, data: any) => ReactNode};
type NavigationStackState = {stateNavigator: AsyncStateNavigator, keys: string[], rest: boolean};

class NavigationStack extends React.Component<NavigationStackProps, NavigationStackState> {
    private ref: React.RefObject<View>;
    private resumeNavigation: () => void;
    constructor(props) {
        super(props);
        this.state = {stateNavigator: null, keys: [], rest: true};
        this.ref = React.createRef<View>();
        this.onWillNavigateBack = this.onWillNavigateBack.bind(this);
        this.onDidNavigateBack = this.onDidNavigateBack.bind(this);
        this.onNavigateToTop = this.onNavigateToTop.bind(this);
        this.onRest = this.onRest.bind(this);
    }
    static defaultProps = {
        unmountStyle: () => null,
        crumbStyle: () => null,
        hidesTabBar: () => false,
        sharedElement: () => null
    }
    static getDerivedStateFromProps({stateNavigator}: NavigationStackProps, {keys: prevKeys, stateNavigator: prevStateNavigator}: NavigationStackState) {
        if (stateNavigator === prevStateNavigator)
            return null;
        var {state, crumbs, nextCrumb} = stateNavigator.stateContext;
        if (!state)
            return {keys: []};
        var prevState = prevStateNavigator && prevStateNavigator.stateContext.state;
        var currentKeys = crumbs.concat(nextCrumb).map((_, i) => '' + i);
        var newKeys = currentKeys.slice(prevKeys.length);
        var keys = prevKeys.slice(0, currentKeys.length).concat(newKeys);
        if (prevKeys.length === keys.length && prevState !== state)
            keys[keys.length - 1] += '+';
        return {keys, stateNavigator, rest: false};
    }
    onWillNavigateBack({nativeEvent}) {
        var {stateNavigator} = this.props;
        var distance = stateNavigator.stateContext.crumbs.length - nativeEvent.crumb;
        this.resumeNavigation = null;
        if (stateNavigator.canNavigateBack(distance)) {
            var url = stateNavigator.getNavigationBackLink(distance);
            stateNavigator.navigateLink(url, undefined, true, (_stateContext, resumeNavigation) => {
                this.resumeNavigation = resumeNavigation;
            });
        }
    }
    onDidNavigateBack({nativeEvent}) {
        var mostRecentEventCount = nativeEvent.eventCount;
        this.ref.current.setNativeProps({mostRecentEventCount});
        if (this.resumeNavigation)
            this.resumeNavigation();
    }
    onNavigateToTop() {
        var {stateNavigator} = this.props;
        var {crumbs} = stateNavigator.stateContext;
        if (crumbs.length > 0)
            stateNavigator.navigateBack(crumbs.length);
    }
    onRest({nativeEvent}) {
        var {stateNavigator} = this.props;
        var {crumbs} = stateNavigator.stateContext;
        if (crumbs.length === nativeEvent.crumb)
            this.setState({rest: true});
    }
    getAnimation() {
        var {stateNavigator, unmountStyle, crumbStyle, sharedElement: getSharedElement} = this.props;
        var {state, data, oldState, oldData, oldUrl, crumbs, nextCrumb} = stateNavigator.stateContext;
        if (!oldState)
            return null;
        var {crumbs: oldCrumbs} = stateNavigator.parseLink(oldUrl);
        if (oldCrumbs.length < crumbs.length) {
            var {state: nextState, data: nextData} = crumbs.concat(nextCrumb)[oldCrumbs.length + 1];
            var enterAnim = unmountStyle(true, state, data, crumbs);
            var exitAnim = crumbStyle(false, oldState, oldData, oldCrumbs, nextState, nextData);
            var sharedElement = getSharedElement(state, data, crumbs);
        }
        if (crumbs.length < oldCrumbs.length) {
            var nextCrumb = new Crumb(oldData, oldState, null, null, false);
            var {state: nextState, data: nextData} = oldCrumbs.concat(nextCrumb)[crumbs.length + 1];
            var enterAnim = crumbStyle(true, state, data, crumbs, nextState, nextData);
            var exitAnim = unmountStyle(false, oldState, oldData, oldCrumbs);
            var oldSharedElement = getSharedElement(oldState, oldData, oldCrumbs);
        }
        if (crumbs.length === oldCrumbs.length) {
            var enterAnim = unmountStyle(true, state, data, crumbs);
            var exitAnim = unmountStyle(false, oldState, oldData, oldCrumbs, state, data);
        }
        return {enterAnim, exitAnim, sharedElement, oldSharedElement};
    }
    render() {
        var {keys, rest} = this.state;
        var {stateNavigator, unmountStyle, crumbStyle, hidesTabBar, title, renderScene} = this.props;
        var {crumbs, nextCrumb} = stateNavigator.stateContext;
        return (
            <NVNavigationStack
                ref={this.ref}
                keys={keys}
                style={styles.stack}
                {...this.getAnimation()}
                onWillNavigateBack={this.onWillNavigateBack}
                onDidNavigateBack={this.onDidNavigateBack}
                onNavigateToTop={this.onNavigateToTop}
                onRest={this.onRest}>
                <PopSync<{crumb: number}>
                    data={crumbs.concat(nextCrumb || []).map((_, crumb) => ({crumb}))}
                    getKey={({crumb}) => keys[crumb]}>
                    {(scenes, popNative) => scenes.map(({key, data: {crumb}}) => (
                        <Scene
                            key={key}
                            crumb={crumb}
                            sceneKey={key}
                            freezable={typeof React.Suspense !== 'undefined' && rest}
                            unmountStyle={unmountStyle}
                            crumbStyle={crumbStyle}
                            hidesTabBar={hidesTabBar}
                            title={title}
                            popped={popNative}
                            renderScene={renderScene} />
                    ))}
                </PopSync>
            </NVNavigationStack>
        );
    }
};

var NVNavigationStack = requireNativeComponent<any>('NVNavigationStack', null);

const styles = StyleSheet.create({
    stack: {
        flex: 1,
        backgroundColor: '#000',
    },
});

export default props => (
    <NavigationContext.Consumer>
        {({stateNavigator}) => <NavigationStack stateNavigator={stateNavigator} {...props} />}
    </NavigationContext.Consumer>
);
