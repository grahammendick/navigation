import React, { ReactNode } from 'react';
import { requireNativeComponent, Platform, StyleSheet, View } from 'react-native';
import { StateNavigator, Crumb, State } from 'navigation';
import { NavigationContext } from 'navigation-react';
import BackButton from './BackButton';
import PopSync from './PopSync';
import Scene from './Scene';
type NavigationStackProps = {stateNavigator: StateNavigator, primary: boolean, fragmentMode: boolean, title: (state: State, data: any) => string, crumbStyle: any, unmountStyle: any, sharedElements: any, renderScene: (state: State, data: any, asyncData: any) => ReactNode};
type NavigationStackState = {stateNavigator: StateNavigator, keys: string[], finish: boolean};

class NavigationStack extends React.Component<NavigationStackProps, NavigationStackState> {
    private ref: React.RefObject<View>;
    constructor(props) {
        super(props);
        this.state = {stateNavigator: null, keys: [], finish: false};
        this.ref = React.createRef<View>();
        this.handleBack = this.handleBack.bind(this);
        this.onDidNavigateBack = this.onDidNavigateBack.bind(this);
    }
    static defaultProps = {
        primary: true,
        fragmentMode: true,
        unmountStyle: () => null,
        crumbStyle: () => null,
        sharedElements: () => null
    }
    static getDerivedStateFromProps({stateNavigator}: NavigationStackProps, {keys: prevKeys, stateNavigator: prevStateNavigator}: NavigationStackState) {
        if (stateNavigator === prevStateNavigator)
            return null;
        var {state, crumbs, nextCrumb} = stateNavigator.stateContext;
        var prevState = prevStateNavigator && prevStateNavigator.stateContext.state;
        var currentKeys = crumbs.concat(nextCrumb).map((_, i) => '' + i);
        var newKeys = currentKeys.slice(prevKeys.length);
        var keys = prevKeys.slice(0, currentKeys.length).concat(newKeys);
        if (prevKeys.length === keys.length && prevState !== state)
            keys[keys.length - 1] += '+';
        return {keys, stateNavigator};
    }
    onDidNavigateBack({nativeEvent}) {
        var {stateNavigator} = this.props;
        var {eventCount: mostRecentEventCount, crumb} = nativeEvent;
        this.ref.current.setNativeProps({mostRecentEventCount});
        var distance = stateNavigator.stateContext.crumbs.length - crumb;
        if (stateNavigator.canNavigateBack(distance)) {
            stateNavigator.navigateBack(distance);
        }
    }
    handleBack() {
        var {primary, fragmentMode} = this.props;
        this.setState(() => (!fragmentMode || primary) ? ({finish: true}): null);
        return !fragmentMode || primary;
    }
    getAnimation() {
        var {stateNavigator, unmountStyle, crumbStyle, sharedElements: getSharedElements} = this.props;
        var {state, data, oldState, oldData, oldUrl, crumbs, nextCrumb} = stateNavigator.stateContext;
        if (!oldState)
            return null;
        var {crumbs: oldCrumbs} = stateNavigator.parseLink(oldUrl);
        if (oldCrumbs.length < crumbs.length) {
            var {state: nextState, data: nextData} = crumbs.concat(nextCrumb)[oldCrumbs.length + 1];
            var enterAnim = unmountStyle(true, state, data, crumbs);
            var exitAnim = crumbStyle(false, oldState, oldData, oldCrumbs, nextState, nextData);
            var sharedElements = getSharedElements(state, data, crumbs);
        }
        if (crumbs.length < oldCrumbs.length) {
            var nextCrumb = new Crumb(oldData, oldState, null, null, false);
            var {state: nextState, data: nextData} = oldCrumbs.concat(nextCrumb)[crumbs.length + 1];
            var enterAnim = crumbStyle(true, state, data, crumbs, nextState, nextData);
            var exitAnim = unmountStyle(false, oldState, oldData, oldCrumbs);
            var oldSharedElements = getSharedElements(oldState, oldData, oldCrumbs);
        }
        if (crumbs.length === oldCrumbs.length) {
            var enterAnim = unmountStyle(true, state, data, crumbs);
            var exitAnim = unmountStyle(false, oldState, oldData, oldCrumbs, state, data);
        }
        return {enterAnim, exitAnim, sharedElements, oldSharedElements};
    }
    render() {
        var {keys, finish} = this.state;
        var {stateNavigator, primary, fragmentMode, unmountStyle, crumbStyle, title, renderScene} = this.props;
        var {crumbs, nextCrumb} = stateNavigator.stateContext;
        return (
            <NVNavigationStack
                ref={this.ref}
                keys={keys}
                primary={primary}
                finish={finish}
                fragmentMode={fragmentMode}
                style={[styles.stack, fragmentMode ? {backgroundColor: '#000'} : null]}
                {...this.getAnimation()}
                onDidNavigateBack={this.onDidNavigateBack}>
                <BackButton onPress={this.handleBack} />
                {Platform.OS === 'android' && <NVFragmentContainer style={styles.stack} />}
                <PopSync<{crumb: number}>
                    data={crumbs.concat(nextCrumb || []).map((_, crumb) => ({crumb}))}
                    getKey={({crumb}) => keys[crumb]}>
                    {(scenes, popNative) => scenes.map(({key, data: {crumb}}) => (
                        <Scene
                            key={key}
                            crumb={crumb}
                            sceneKey={key}
                            unmountStyle={unmountStyle}
                            crumbStyle={crumbStyle}
                            title={title}
                            popped={popNative}
                            renderScene={renderScene} />
                    ))}
                </PopSync>
            </NVNavigationStack>
        );
    }
};

var NVFragmentContainer = requireNativeComponent<any>('NVFragmentContainer', null);
var NVNavigationStack = requireNativeComponent<any>('NVNavigationStack', null);

const styles = StyleSheet.create({
    stack: {
        flex: 1,
    },
});

export default props => (
    <NavigationContext.Consumer>
        {(navigationEvent) => <NavigationStack stateNavigator={navigationEvent.stateNavigator} {...props} />}
    </NavigationContext.Consumer>
)
