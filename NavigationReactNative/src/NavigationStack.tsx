import React, { ReactNode } from 'react';
import { requireNativeComponent, StyleSheet, View } from 'react-native';
import { Crumb, State } from 'navigation';
import { NavigationContext, AsyncStateNavigator } from 'navigation-react';
import PopSync from './PopSync';
import Scene from './Scene';
type NavigationStackProps = {stateNavigator: AsyncStateNavigator, underlayColor: string, title: (state: State, data: any) => string, crumbStyle: any, unmountStyle: any, hidesTabBar: any, sharedElement: any, renderScene: (state: State, data: any) => ReactNode};
type NavigationStackState = {stateNavigator: AsyncStateNavigator, keys: string[], rest: boolean};

class NavigationStack extends React.Component<NavigationStackProps, NavigationStackState> {
    private ref: React.RefObject<View>;
    private resumeNavigation: () => void;
    constructor(props) {
        super(props);
        this.state = {stateNavigator: null, keys: [], rest: true};
        this.ref = React.createRef<View>();
        this.onWillNavigateBack = this.onWillNavigateBack.bind(this);
        this.onNavigateToTop = this.onNavigateToTop.bind(this);
        this.onRest = this.onRest.bind(this);
    }
    static defaultProps = {
        underlayColor: '#000',
        unmountStyle: () => null,
        crumbStyle: () => null,
        hidesTabBar: () => false,
        sharedElement: () => null,
    }
    static getDerivedStateFromProps({stateNavigator}: NavigationStackProps, {keys: prevKeys, stateNavigator: prevStateNavigator}: NavigationStackState) {
        if (stateNavigator === prevStateNavigator)
            return null;
        var {state, crumbs, nextCrumb, history} = stateNavigator.stateContext;
        if (!state)
            return {keys: []};
        var prevState = prevStateNavigator && prevStateNavigator.stateContext.state;
        var currentKeys = crumbs.concat(nextCrumb).map((_, i) => '' + i);
        var newKeys = currentKeys.slice(prevKeys.length);
        var keys = prevKeys.slice(0, currentKeys.length).concat(newKeys);
        if (prevKeys.length === keys.length && prevState !== state)
            keys[keys.length - 1] += '+';
        return {keys, stateNavigator, rest: history};
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
    onNavigateToTop() {
        var {stateNavigator} = this.props;
        var {crumbs} = stateNavigator.stateContext;
        if (crumbs.length > 0)
            stateNavigator.navigateBack(crumbs.length);
    }
    onRest({nativeEvent}) {
        var {stateNavigator} = this.props;
        var {crumbs} = stateNavigator.stateContext;
        var mostRecentEventCount = nativeEvent.eventCount;
        if (mostRecentEventCount) {
            this.ref.current.setNativeProps({mostRecentEventCount});
            if (this.resumeNavigation)
                this.resumeNavigation();
        } else if (crumbs.length === nativeEvent.crumb) {
            this.setState({rest: true});
        }
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
        var {stateNavigator, underlayColor, unmountStyle, crumbStyle, hidesTabBar, title, renderScene} = this.props;
        var {crumbs, nextCrumb} = stateNavigator.stateContext;
        return (
            <NVNavigationStack
                ref={this.ref}
                keys={keys}
                style={[styles.stack, {backgroundColor: underlayColor}]}
                {...this.getAnimation()}
                onWillNavigateBack={this.onWillNavigateBack}
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
                            rest={rest}
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
    },
});

export default props => (
    <NavigationContext.Consumer>
        {({stateNavigator}) => <NavigationStack stateNavigator={stateNavigator} {...props} />}
    </NavigationContext.Consumer>
);
