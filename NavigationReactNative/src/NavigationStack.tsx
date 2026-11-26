import React, { ReactNode, ReactElement, useRef, useState, useContext, useEffect, useMemo, useLayoutEffect } from 'react';
import { Platform, requireNativeComponent, StyleSheet } from 'react-native';
import { StateNavigator, Crumb, State, StateContext } from 'navigation';
import { NavigationContext, TransitionContext, SceneView, useRootViewRegistry } from 'navigation-react';
import FragmentContext from './FragmentContext';
import InsetsContext from './InsetsContext';
import PopSync from './PopSync';
import Scene from './Scene';
type NavigationStackProps = {underlayColor: string, title: (state: State, data: any) => string, customAnimation: boolean, crumbStyle: any, unmountStyle: any, hidesTabBar: any, sharedElement: any, sharedElements: any, backgroundColor: any, landscape: any, stackInvalidatedLink: string, renderScene: (state: State, data: any) => ReactNode, children: any};
type CommittedStack = {stateNavigator: StateNavigator, keys: string[], refresh: boolean, counter: number};

const NavigationStack = ({underlayColor: underlayColorStack = '#000', title, customAnimation = Platform.OS === 'android', crumbStyle: crumbStyleStack = () => null, unmountStyle: unmountStyleStack = () => null,
    hidesTabBar: hidesTabBarStack = () => false, sharedElement: getSharedElementStack = () => null, sharedElements: getSharedElementsStack = () => null, backgroundColor: backgroundColorStack = () => null,
    landscape: landscapeStack = () => null, stackInvalidatedLink, renderScene, children}: NavigationStackProps) => {
    const resumeNavigationRef = useRef(null);
    const ref = useRef(null);
    const fragmentTag = React.useId?.();
    const ancestorFragmentTags = useContext(FragmentContext);
    const fragmentTags = useMemo(() => fragmentTag ? [...ancestorFragmentTags, fragmentTag] : [], [ancestorFragmentTags, fragmentTag]);
    const insets = useRef({top: 0, bottom: 0});
    const navigationEvent = useContext(NavigationContext);
    const navigationTransition = useContext(TransitionContext);
    const registerRootView = useRootViewRegistry();
    const resetLinkStateContext = useRef(null);
    const committedStack = useRef<CommittedStack>({stateNavigator: null, keys: [], refresh: false, counter: 0});
    const [restNavigator, setRestNavigator] = useState<StateNavigator>(null);
    const [mostRecentEventCount, setMostRecentEventCount] = useState(0);
    const scenes = {};
    let firstLink;
    const findScenes = (elements = children, nested = false) => {
        for(const scene of React.Children.toArray(elements) as ReactElement<any>[]) {
            const {stateKey, children} = scene.props;
            if (scene.type === NavigationStack.Scene) {
                firstLink = firstLink || navigationEvent.stateNavigator.fluent().navigate(stateKey).url;
                scenes[stateKey] = scene;
            }
            else if (!nested) findScenes(children, true)
        }
    }
    findScenes();
    const prevScenes = useRef({});
    const allScenes = {...prevScenes.current, ...scenes};
    const firstNavigationEvent = useMemo(() => {
        const {stateNavigator} = navigationEvent;
        if (!firstLink || stateNavigator.stateContext.state) return null;
        const firstNavigator = new StateNavigator(stateNavigator, stateNavigator.historyManager);
        firstNavigator.navigateLink(firstLink);
        const {oldState, state, data, asyncData} = firstNavigator.stateContext;
        return {oldState, state, data, asyncData, stateNavigator: firstNavigator, refetching: true, rscCache: navigationEvent['rscCache']} as any;
    }, [firstLink, navigationEvent]);
    const getRootViews = (scene: ReactElement<any>) => {
        const {stateKey, client} = scene.props;
        if (client === false) return [{key: stateKey, active: stateKey}];
        const rootViews: {key: string, active: string | string[]}[] = [];
        const findRootViews = (elements) => {
            for (const sceneView of React.Children.toArray(elements) as any) {
                const {name, active, client, __scene, children} = sceneView.props || {};
                if (__scene || (sceneView.type === SceneView && client === false)) rootViews.push({key: name || (typeof active === 'string' ? active : active[0]), active});
                else if (children) findRootViews(children);
            }
        };
        findRootViews(scene.props.children);
        return rootViews;
    };
    const primeRootViews = (stateKey: string, rscFetching = {}) => {
        for (const {key: sceneViewKey, active} of getRootViews(allScenes[stateKey])) {
            if (typeof active === 'string' ? active === stateKey : active.indexOf(stateKey) !== -1)
                rscFetching[sceneViewKey] ||= false;
        }
        return rscFetching;
    };
    if (firstNavigationEvent && !firstNavigationEvent.rscFetching) firstNavigationEvent.rscFetching = primeRootViews(firstNavigationEvent.state.key);
    const firstNavigationTransition = useMemo(() => firstNavigationEvent && {navigationEvent: firstNavigationEvent, nextNavigationEvent: firstNavigationEvent}, [firstNavigationEvent]);
    useEffect(() => {
        prevScenes.current = allScenes;
        const {stateNavigator} = navigationEvent;
        const {state, crumbs, nextCrumb} = stateNavigator.stateContext;
        const validate = ({key}) => !!scenes[key];
        if (firstLink) {
            stateNavigator.onBeforeNavigate(validate);
            let resetLink = !state ? firstLink : undefined;
            if (!resetLink && [...crumbs, nextCrumb].find(({state}) => !scenes[state.key]))
                resetLink = stackInvalidatedLink != null ? stackInvalidatedLink : firstLink;
            if (resetLink != null && stateNavigator.stateContext !== resetLinkStateContext.current) {
                stateNavigator.navigateLink(resetLink);
                resetLinkStateContext.current = stateNavigator.stateContext;
            }
        }
        return () => stateNavigator.offBeforeNavigate(validate);
    }, [children, navigationEvent, scenes, allScenes, stackInvalidatedLink]);
    const stateNavigator = firstNavigationEvent?.stateNavigator || navigationEvent.stateNavigator;
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
    const onApplyInsets = ({nativeEvent: {top, bottom}}) => {
        insets.current = {top, bottom};
    }
    const onRest = ({nativeEvent}) => {
        const {crumbs} = stateNavigator.stateContext;
        const mostRecentEventCount = nativeEvent.eventCount;
        if (mostRecentEventCount) {
            setMostRecentEventCount(mostRecentEventCount);
            if (resumeNavigationRef.current) {
                resumeNavigationRef.current();
                resumeNavigationRef.current = null;
            }
        } else if (crumbs.length === nativeEvent.crumb) {
            setRestNavigator(stateNavigator);
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
            if (oldCrumbs[crumbs.length].state !== state) {
                enterAnim = unmountStyle(true, state, data, crumbs);
                exitAnim = unmountStyle(false, oldState, oldData, oldCrumbs, state, data);
            }
        }
        if (crumbs.length === oldCrumbs.length) {
            enterAnim = unmountStyle(true, state, data, crumbs);
            exitAnim = unmountStyle(false, oldState, oldData, oldCrumbs, state, data);
            sharedElements = getSharedElement(state, data, crumbs) || getSharedElements(state, data, crumbs);
        }
        const containerTransform = typeof sharedElements === 'string';
        sharedElements = containerTransform && sharedElements ? [sharedElements] : sharedElements;
        let enterTrans = typeof enterAnim === 'string' ? null : enterAnim;
        let exitTrans = typeof exitAnim === 'string' ? null : exitAnim;
        enterTrans = !enterTrans?.type ? enterTrans : [enterTrans];
        exitTrans = !exitTrans?.type ? exitTrans : [exitTrans];
        enterTrans = !Array.isArray(enterTrans) ? enterTrans : {items: enterTrans};
        exitTrans = !Array.isArray(exitTrans) ? exitTrans : {items: exitTrans};
        const convertEnterTrans = ({type, axis, start, from, startX, fromX, startY, fromY, pivotX, pivotY, items, duration}) => ({
            type, axis,
            from: (start ?? from) !== undefined ? '' + (start ?? from) : undefined,
            fromX: (startX ?? fromX) !== undefined ? '' + (startX ?? fromX) : undefined,
            fromY: (startY ?? fromY) !== undefined ? '' + (startY ?? fromY) : undefined,
            pivotX: pivotX !== undefined ? '' + pivotX : undefined,
            pivotY: pivotY !== undefined ? '' + pivotY : undefined,
            duration: duration !== undefined ? '' + duration : undefined,
            items: items?.map(convertEnterTrans),
        })
        const convertExitTrans = ({type, axis, start, to, startX, toX, startY, toY, pivotX, pivotY, items, duration}) => ({
            type, axis,
            to: (start ?? to) !== undefined ? '' + (start ?? to) : undefined,
            toX: (startX ?? toX) !== undefined ? '' + (startX ?? toX) : undefined,
            toY: (startY ?? toY) !== undefined ? '' + (startY ?? toY) : undefined,
            pivotX: pivotX !== undefined ? '' + pivotX : undefined,
            pivotY: pivotY !== undefined ? '' + pivotY : undefined,
            duration: duration !== undefined ? '' + duration : undefined,
            items: items?.map(convertExitTrans),
        });
        enterTrans = enterTrans ? convertEnterTrans(enterTrans) : null;
        exitTrans = exitTrans ? convertExitTrans(exitTrans) : null;
        enterAnim = !enterTrans ? enterAnim : null;
        exitAnim = !exitTrans ? exitAnim : null;
        enterTrans = customAnimation ? enterTrans : undefined;
        exitTrans = customAnimation ? exitTrans : undefined;
        enterAnim = customAnimation || enterAnim === '' ? enterAnim : undefined;
        exitAnim = customAnimation || exitAnim === '' ? exitAnim : undefined;
        const enterAnimOff = enterAnim === '';
        return {enterAnim, exitAnim, enterAnimOff, enterTrans, exitTrans, sharedElements, containerTransform, underlayColor, backgroundColor: underlayColor};
    }
    const {keys, refresh, counter} = useMemo(() => {
        const {stateNavigator: prevStateNavigator, keys: prevKeys, refresh: prevRefresh, counter} = committedStack.current;
        if (prevStateNavigator === stateNavigator || !stateNavigator.stateContext.state)
            return {keys: prevKeys, refresh: prevRefresh, counter};
        const {state, crumbs, nextCrumb} = stateNavigator.stateContext;
        const currentKeys = crumbs.concat(nextCrumb).map((_, i) => `${counter}-${i}`);
        const newKeys = currentKeys.slice(prevKeys.length);
        const keys = prevKeys.slice(0, currentKeys.length).concat(newKeys);
        if ((prevKeys.length === keys.length && prevStateNavigator.stateContext.state !== state) ||
            (prevKeys.length > keys.length && prevStateNavigator.stateContext.crumbs[keys.length - 1].state !== state))
            keys[keys.length - 1] = currentKeys[keys.length - 1];
        const refresh = prevKeys.length === keys.length && prevKeys[keys.length - 1] === keys[keys.length - 1];
        const {oldState, oldUrl} = stateNavigator.stateContext;
        const refreshNav = state === oldState && oldUrl?.split('crumb=').length - 1 === crumbs.length;
        if (!refreshNav && allScenes[state.key])
            navigationEvent['rscFetching'] = primeRootViews(state.key, navigationEvent['rscFetching']);
        return {keys, refresh, counter: (counter + 1) % 1000};
    }, [stateNavigator]);
    const rest = restNavigator === stateNavigator || stateNavigator.stateContext.history || refresh;
    useLayoutEffect(() => {
        committedStack.current = {stateNavigator, keys, refresh, counter};
    });
    useLayoutEffect(() => {
        for (const key of Object.keys(allScenes)) {
            for (const {key: sceneViewKey, active} of getRootViews(allScenes[key]))
                registerRootView(sceneViewKey, active);
        }
    }, [registerRootView, allScenes]);
    const {crumbs, nextCrumb} = stateNavigator.stateContext;
    return (
        <FragmentContext.Provider value={fragmentTags}>
            <InsetsContext.Provider value={insets.current}>
                <NavigationContext.Provider value={firstNavigationEvent || navigationEvent}>
                    <TransitionContext.Provider value={firstNavigationTransition || navigationTransition}>
                        <NVNavigationStack
                            ref={ref}
                            keys={keys}
                            fragmentTag={fragmentTag}
                            ancestorFragmentTags={ancestorFragmentTags}
                            mostRecentEventCount={mostRecentEventCount}
                            customAnimation={customAnimation}
                            style={styles.stack}
                            {...getAnimation()}
                            onWillNavigateBack={onWillNavigateBack}
                            onNavigateToTop={onNavigateToTop}
                            onApplyInsets={onApplyInsets}
                            onRest={onRest}>
                            <PopSync<{crumb: number, url: string, stateKey: string}>
                                data={crumbs.concat(nextCrumb || []).map(({url, state: {key: stateKey}}, crumb) => ({crumb, url, stateKey}))}
                                getKey={({crumb}) => keys[crumb]}>
                                {(scenes, popNative) => scenes.map(({key, data: {crumb, url, stateKey}}) => (
                                    <Scene
                                        key={key}
                                        url={url}
                                        crumb={crumb}
                                        sceneKey={key}
                                        rest={rest}
                                        customAnimation={customAnimation}
                                        unmountStyle={unmountStyle}
                                        crumbStyle={crumbStyle}
                                        hidesTabBar={hidesTabBar}
                                        backgroundColor={backgroundColor}
                                        landscape={landscape}
                                        title={title}
                                        popped={popNative}
                                        primeRefetch={() => primeRootViews(stateKey)}
                                        renderScene={firstLink ? ({key}) => allScenes[key] : renderScene} />
                                ))}
                            </PopSync>
                        </NVNavigationStack>
                    </TransitionContext.Provider>
                </NavigationContext.Provider>
            </InsetsContext.Provider>
        </FragmentContext.Provider>
    );
}

const NVNavigationStack = global.nativeFabricUIManager ? require('./NavigationStackNativeComponent').default : requireNativeComponent('NVNavigationStack');

NavigationStack.Scene = ({stateKey, client, children, ...props}) => (
    client === false ? <SceneView active={stateKey} name={stateKey} {...{client: false, ...props} as any} /> : children
);

const styles = StyleSheet.create({
    stack: {
        flex: 1,
    },
});

export default NavigationStack;
