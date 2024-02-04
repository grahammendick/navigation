import React, { ReactNode, ReactElement, useRef, useState, useContext, useEffect } from 'react';
import { requireNativeComponent, StyleSheet } from 'react-native';
import { StateNavigator, Crumb, State } from 'navigation';
import { NavigationContext } from 'navigation-react';
import PopSync from './PopSync';
import Scene from './Scene';
type NavigationStackProps = {underlayColor: string, title: (state: State, data: any) => string, crumbStyle: any, unmountStyle: any, hidesTabBar: any, sharedElement: any, sharedElements: any, backgroundColor: any, landscape: any, stackInvalidatedLink: string, renderScene: (state: State, data: any) => ReactNode, children: any};
type NavigationStackState = {stateNavigator: StateNavigator, keys: string[], rest: boolean, counter: number, mostRecentEventCount: number};

const NavigationStack = ({underlayColor: underlayColorStack = '#000', title, crumbStyle: crumbStyleStack = () => null, unmountStyle: unmountStyleStack = () => null,
    hidesTabBar: hidesTabBarStack = () => false, sharedElement: getSharedElementStack = () => null, sharedElements: getSharedElementsStack = () => null,
    backgroundColor: backgroundColorStack = () => null, landscape: landscapeStack = () => null, stackInvalidatedLink, renderScene, children}: NavigationStackProps) => {
    const resumeNavigationRef = useRef(null);
    const ref = useRef(null);
    const {stateNavigator} = useContext(NavigationContext);
    const [stackState, setStackState] = useState<NavigationStackState>({stateNavigator: null, keys: [], rest: true, counter: 0, mostRecentEventCount: 0});
    const scenes = {};
    let firstLink;
    const findScenes = (elements = children, nested = false) => {
        for(const scene of React.Children.toArray(elements) as ReactElement<any>[]) {
            const {stateKey, children} = scene.props;
            if (scene.type === NavigationStack.Scene) {
                firstLink = firstLink || stateNavigator.fluent().navigate(stateKey).url;
                scenes[stateKey] = scene;
            }
            else if (!nested) findScenes(children, true)
        }
    }
    findScenes();
    const prevScenes = useRef({});
    const allScenes = {...prevScenes.current, ...scenes};
    useEffect(() => {
        prevScenes.current = allScenes;
        const {state, crumbs, nextCrumb} = stateNavigator.stateContext;
        const validate = ({key}) => !!scenes[key];
        if (firstLink) {
            stateNavigator.onBeforeNavigate(validate);
            let resetLink = !state ? firstLink : undefined;
            if (!resetLink && [...crumbs, nextCrumb].find(({state}) => !scenes[state.key]))
                resetLink = stackInvalidatedLink != null ? stackInvalidatedLink : firstLink;
            if (resetLink != null) stateNavigator.navigateLink(resetLink);
        }
        return () => stateNavigator.offBeforeNavigate(validate);
    }, [children, stateNavigator, scenes, allScenes, stackInvalidatedLink]);
    const onWillNavigateBack = ({nativeEvent}) => {
        const distance = stateNavigator.stateContext.crumbs.length - nativeEvent.crumb;
        resumeNavigationRef.current = null;
        if (stateNavigator.canNavigateBack(distance)) {
            const url = stateNavigator.getNavigationBackLink(distance);
            stateNavigator.navigateLink(url, undefined, true, (_stateContext, resumeNavigation) => {
                resumeNavigationRef.current = resumeNavigation;
            });
        }
    }
    const onNavigateToTop = () => {
        const {crumbs} = stateNavigator.stateContext;
        if (crumbs.length > 0)
            stateNavigator.navigateBack(crumbs.length);
    }
    const onRest = ({nativeEvent}) => {
        const {crumbs} = stateNavigator.stateContext;
        const mostRecentEventCount = nativeEvent.eventCount;
        if (mostRecentEventCount) {
            setStackState((prevStackState) => ({...prevStackState, mostRecentEventCount}));
            if (resumeNavigationRef.current)
                resumeNavigationRef.current();
        } else if (crumbs.length === nativeEvent.crumb) {
            setStackState(prevStackState => ({...prevStackState, rest: true}));
        }
    }
    const sceneProps = ({key}: State) => firstLink ? allScenes[key].props : null;
    const returnOrCall = (item, ...args) => typeof item !== 'function' ? item : item(...args);
    const unmountStyle = (from, state, ...rest) => sceneProps(state)?.unmountStyle ? returnOrCall(sceneProps(state)?.unmountStyle, from, ...rest) : returnOrCall(unmountStyleStack, from, state, ...rest);
    const crumbStyle = (from, state, ...rest) => sceneProps(state)?.crumbStyle ? returnOrCall(sceneProps(state)?.crumbStyle, from, ...rest) : returnOrCall(crumbStyleStack, from, state, ...rest);
    const hidesTabBar = (state, ...rest) => sceneProps(state)?.hidesTabBar ? returnOrCall(sceneProps(state)?.hidesTabBar, ...rest) : hidesTabBarStack(state, ...rest);
    const getSharedElement = (state, ...rest) => sceneProps(state)?.sharedElement ? returnOrCall(sceneProps(state)?.sharedElement, ...rest) : getSharedElementStack(state, ...rest);
    const getSharedElements = (state, ...rest) => sceneProps(state)?.sharedElements ? returnOrCall(sceneProps(state)?.sharedElements, ...rest) : getSharedElementsStack(state, ...rest);
    const backgroundColor = (state, ...rest) => sceneProps(state)?.backgroundColor ? returnOrCall(sceneProps(state)?.backgroundColor, ...rest) : backgroundColorStack(state, ...rest);
    const getUnderlayColor = (state, ...rest) => state && sceneProps(state)?.underlayColor ? returnOrCall(sceneProps(state)?.underlayColor, ...rest) : returnOrCall(underlayColorStack, state, ...rest);
    const landscape = (state, ...rest) => sceneProps(state)?.landscape ? returnOrCall(sceneProps(state)?.landscape, ...rest) : landscapeStack(state, ...rest);
    const getAnimation = () => {
        let {state, data, oldState, oldData, oldUrl, crumbs, nextCrumb} = stateNavigator.stateContext;
        const underlayColor = getUnderlayColor(state, data, crumbs);
        if (!oldState)
            return {backgroundColor: underlayColor};
        const {crumbs: oldCrumbs} = stateNavigator.parseLink(oldUrl);
        let enterAnim, exitAnim, sharedElements;
        if (oldCrumbs.length < crumbs.length) {
            const {state: nextState, data: nextData} = crumbs.concat(nextCrumb)[oldCrumbs.length + 1];
            enterAnim = unmountStyle(true, state, data, crumbs);
            exitAnim = crumbStyle(false, oldState, oldData, oldCrumbs, nextState, nextData);
            sharedElements = getSharedElement(state, data, crumbs) || getSharedElements(state, data, crumbs);
        }
        if (crumbs.length < oldCrumbs.length) {
            nextCrumb = new Crumb(oldData, oldState, null, null, false);
            const {state: nextState, data: nextData} = oldCrumbs.concat(nextCrumb)[crumbs.length + 1];
            enterAnim = crumbStyle(true, state, data, crumbs, nextState, nextData);
            exitAnim = unmountStyle(false, oldState, oldData, oldCrumbs);
            sharedElements = getSharedElement(oldState, oldData, oldCrumbs) || getSharedElements(oldState, oldData, oldCrumbs);
        }
        if (crumbs.length === oldCrumbs.length) {
            enterAnim = unmountStyle(true, state, data, crumbs);
            exitAnim = unmountStyle(false, oldState, oldData, oldCrumbs, state, data);
        }
        const containerTransform = typeof sharedElements === 'string';
        sharedElements = containerTransform && sharedElements ? [sharedElements] : sharedElements;
        let enterTrans = typeof enterAnim === 'string' ? null : enterAnim;
        let exitTrans = typeof exitAnim === 'string' ? null : exitAnim;
        if (enterTrans) {
            const {start, startX, startY, items, ...rest} = enterTrans;
            enterTrans = {
                from: start, fromX: startX, fromY: startY, ...rest,
                items: items?.map(({start, startX, startY, ...rest}) => (
                    {from: start, fromX: startX, fromY: startY, ...rest}
                ))
            };
        }
        if (exitTrans) {
            const {start, startX, startY, items, ...rest} = exitTrans;
            exitTrans = {
                to: start, toX: startX, toY: startY, ...rest,
                items: items?.map(({start, startX, startY, ...rest}) => (
                    {to: start, toX: startX, toY: startY, ...rest}
                ))
            };
        }
        enterAnim = !enterTrans ? enterAnim : null;
        exitAnim = !exitTrans ? exitAnim : null;
        const enterAnimOff = enterAnim === '';
        return {enterAnim, exitAnim, enterAnimOff, enterTrans, exitTrans, sharedElements, containerTransform, backgroundColor: underlayColor};
    }
    const {stateNavigator: prevStateNavigator, keys, rest, mostRecentEventCount} = stackState;
    if (prevStateNavigator !== stateNavigator && stateNavigator.stateContext.state) {
        setStackState((prevStackState) => {
            const {keys: prevKeys, stateNavigator: prevStateNavigator, counter} = prevStackState;
            const {state, crumbs, nextCrumb, history} = stateNavigator.stateContext;
            const prevState = prevStateNavigator && prevStateNavigator.stateContext.state;
            const currentKeys = crumbs.concat(nextCrumb).map((_, i) => `${counter}-${i}`);
            const newKeys = currentKeys.slice(prevKeys.length);
            const keys = prevKeys.slice(0, currentKeys.length).concat(newKeys);
            if (prevKeys.length === keys.length && prevState !== state)
                keys[keys.length - 1] = `${counter}-${keys.length - 1}`;
            const refresh = prevKeys.length === keys.length && prevState === state;
            return {keys, stateNavigator, rest: history || refresh, counter: (counter + 1) % 1000, mostRecentEventCount};
        });
    }
    const {crumbs, nextCrumb} = stateNavigator.stateContext;
    return (
        <NVNavigationStack
            ref={ref}
            keys={keys}
            mostRecentEventCount={mostRecentEventCount}
            style={styles.stack}
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
                        backgroundColor={backgroundColor}
                        landscape={landscape}
                        title={title}
                        popped={popNative}
                        renderScene={firstLink ? ({key}) => allScenes[key] : renderScene} />
                ))}
            </PopSync>
        </NVNavigationStack>
    );
}

const NVNavigationStack = global.nativeFabricUIManager ? require('./NavigationStackNativeComponent').default : requireNativeComponent('NVNavigationStack');

NavigationStack.Scene = ({children}) => children;

const styles = StyleSheet.create({
    stack: {
        flex: 1,
    },
});

export default NavigationStack;
