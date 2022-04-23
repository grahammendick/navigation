import React, { ReactNode, useRef, useState, useContext } from 'react';
import { requireNativeComponent, StyleSheet, View } from 'react-native';
import { Crumb, State } from 'navigation';
import { NavigationContext, AsyncStateNavigator } from 'navigation-react';
import PopSync from './PopSync';
import Scene from './Scene';
type NavigationStackProps = {underlayColor: string, title: (state: State, data: any) => string, crumbStyle: any, unmountStyle: any, hidesTabBar: any, sharedElement: any, renderScene: (state: State, data: any) => ReactNode};
type NavigationStackState = {stateNavigator: AsyncStateNavigator, keys: string[], rest: boolean, counter: number};

const NavigationStack = ({underlayColor = '#000', title, crumbStyle = () => null,
    unmountStyle = () => null, hidesTabBar = () => false, sharedElement: getSharedElement = () => null, renderScene}: NavigationStackProps) => {
    const resumeNavigationRef = useRef(null);
    const ref = useRef(null);
    const {stateNavigator} = useContext(NavigationContext);
    const [navigationState, setNavigationState] = useState<NavigationStackState>({stateNavigator: null, keys: [], rest: true, counter: 0});
    const onWillNavigateBack = ({nativeEvent}) => {
        var distance = stateNavigator.stateContext.crumbs.length - nativeEvent.crumb;
        resumeNavigationRef.current = null;
        if (stateNavigator.canNavigateBack(distance)) {
            var url = stateNavigator.getNavigationBackLink(distance);
            stateNavigator.navigateLink(url, undefined, true, (_stateContext, resumeNavigation) => {
                resumeNavigationRef.current = resumeNavigation;
            });
        }
    }
    const onNavigateToTop = () => {
        var {crumbs} = stateNavigator.stateContext;
        if (crumbs.length > 0)
            stateNavigator.navigateBack(crumbs.length);
    }
    const onRest = ({nativeEvent}) => {
        var {crumbs} = stateNavigator.stateContext;
        var mostRecentEventCount = nativeEvent.eventCount;
        if (mostRecentEventCount) {
            ref.current.setNativeProps({mostRecentEventCount});
            if (resumeNavigationRef.current)
                resumeNavigationRef.current();
        } else if (crumbs.length === nativeEvent.crumb) {
            setNavigationState(prevNavigationState => ({...prevNavigationState, rest: true}));
        }
    }
    const getAnimation = () => {
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
    var {stateNavigator: prevStateNavigator, keys, rest} = navigationState;
    if (prevStateNavigator !== stateNavigator) {
        setNavigationState((prevNavigationState) => {
            const {keys: prevKeys, stateNavigator: prevStateNavigator, counter} = prevNavigationState;
            var {state, crumbs, nextCrumb, history} = stateNavigator.stateContext;
            if (!state)
                return {...prevNavigationState, keys: []};
            var prevState = prevStateNavigator && prevStateNavigator.stateContext.state;
            var currentKeys = crumbs.concat(nextCrumb).map((_, i) => `${counter}-${i}`);
            var newKeys = currentKeys.slice(prevKeys.length);
            var keys = prevKeys.slice(0, currentKeys.length).concat(newKeys);
            if (prevKeys.length === keys.length && prevState !== state)
                keys[keys.length - 1] = `${counter}-${keys.length - 1}`;
            const refresh = prevKeys.length === keys.length && prevState === state;
            return {keys, stateNavigator, rest: history || refresh, counter: (counter + 1) % 1000};
        });
    }
    var {crumbs, nextCrumb} = stateNavigator.stateContext;
    return (
        <NVNavigationStack
            ref={ref}
            keys={keys}
            style={[styles.stack, {backgroundColor: underlayColor}]}
            {...getAnimation()}
            onWillNavigateBack={onWillNavigateBack}
            onNavigateToTop={onNavigateToTop}
            onRest={onRest}>
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

var NVNavigationStack = requireNativeComponent<any>('NVNavigationStack', null);

const styles = StyleSheet.create({
    stack: {
        flex: 1,
    },
});

export default NavigationStack;
