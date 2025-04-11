'use client'
import React, {useRef, useState, useContext, useEffect, ReactElement} from 'react';
import { State, StateNavigator } from 'navigation';
import { NavigationContext } from 'navigation-react';
import Scene from './Scene.js';
import Freeze from './Freeze.js';
import SharedElementContext from './SharedElementContext.js';
import NavigationAnimation from './NavigationAnimation.js';
import { NavigationMotionProps as NavigationStackProps } from './Props.js';
import SharedElementAnimation from './SharedElementAnimation.js';
import useSharedElementRegistry from './useSharedElementRegistry.js';
import RSCContext from './RSCContext.js';
type NavigationStackState = {stateNavigator: StateNavigator, keys: string[], rest: boolean, ignorePause: boolean};

const NavigationStack = ({unmountStyle: unmountStyleStack, crumbStyle: crumbStyleStack, sharedElements: sharedElementsStack,
    className: sceneClassName, style: sceneStyle, duration = 300, renderScene, children, stackInvalidatedLink}: NavigationStackProps) => {
    const sharedElementRegistry = useSharedElementRegistry();
    const {stateNavigator} = useContext(NavigationContext);
    const [motionState, setMotionState] = useState<NavigationStackState>({stateNavigator: null, keys: [], rest: false, ignorePause: false});
    const scenes = {};
    let rsc = false;
    let firstLink;
    const findScenes = (elements = children, nested = false) => {
        for(const scene of React.Children.toArray(elements) as ReactElement<any>[]) {
            const {stateKey, children, __scene} = scene.props;
            rsc = rsc || __scene;
            if (scene.type === NavigationStack.Scene || __scene) {
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
    const getSharedElements = () => {
        const {url, state, data, crumbs, oldUrl, oldState, oldData} = stateNavigator.stateContext;
        if (oldUrl) {
            const {crumbs: oldCrumbs} = stateNavigator.parseLink(oldUrl);
            if (Math.abs(oldCrumbs.length - crumbs.length) !== 1)
                return {pause: null, sharedEls: []}; 
            const sharedElementNames: string[] = oldCrumbs.length < crumbs.length
                ? sharedElements(state, data, crumbs) : crumbs.length < oldCrumbs.length
                ? sharedElements(oldState, oldData, oldCrumbs) : null;
            if (sharedElementNames?.length) {
                const sharedEls = 
                    sharedElementRegistry.getSharedElements(url, oldUrl)
                        .filter(({name}) => sharedElementNames.indexOf(name) >= 0);
                const pause = sharedElementNames.length !== sharedEls.length ? crumbs.length : null;
                return {pause, sharedEls};
            }
            return {pause: null, sharedEls: []};
        }
        return {pause: null, sharedEls: []};
    }
    const clearScene = ({key, url}) => {
        setMotionState(({rest: prevRest, stateNavigator, keys, ignorePause}) => {
            const scene = getScenes().filter(scene => scene.key === key)[0];
            if (!scene)
                sharedElementRegistry.unregisterSharedElement(url);
            var rest = prevRest || (scene && scene.mount);
            return {rest, stateNavigator, keys, ignorePause};
        });
    }
    const getScenes = () => {
        const {keys} = motionState;
        const {crumbs, nextCrumb} = stateNavigator.stateContext;
        if (!nextCrumb) return null;
        return crumbs.concat(nextCrumb).map(({state, data, url}, index, crumbsAndNext) => {
            const preCrumbs = crumbsAndNext.slice(0, index);
            const {state: nextState, data: nextData} = crumbsAndNext[index + 1] || {state: undefined, data: undefined};
            const mount = url === nextCrumb.url;
            return {key: keys[index], index, url, mount, style: style(state, data, preCrumbs),
                className: className(state, data, preCrumbs),
                unmountStyle: unmountStyle(state, data, preCrumbs),
                crumbStyle: crumbStyle(state, data, preCrumbs, nextState, nextData)};
        });
    }
    const sceneProps = ({key}: State) => firstLink ? allScenes[key].props : null;
    const returnOrCall = (item, ...args) => typeof item !== 'function' ? item : item(...args);
    const unmountStyle = (state, ...rest) => sceneProps(state)?.unmountStyle ? returnOrCall(sceneProps(state)?.unmountStyle, ...rest) : returnOrCall(unmountStyleStack, state, ...rest);
    const crumbStyle = (state, ...rest) => sceneProps(state)?.crumbStyle ? returnOrCall(sceneProps(state)?.crumbStyle, ...rest) : returnOrCall(crumbStyleStack, state, ...rest);
    const sharedElements = (state, ...rest) => sceneProps(state)?.sharedElements ? returnOrCall(sceneProps(state)?.sharedElements, ...rest) : returnOrCall(sharedElementsStack, state, ...rest);
    const className = (state, ...rest) => sceneProps(state)?.className ? returnOrCall(sceneProps(state)?.className, ...rest) : returnOrCall(sceneClassName, state, ...rest);
    const style = (state, ...rest) => sceneProps(state)?.style ? returnOrCall(sceneProps(state)?.style, ...rest) : returnOrCall(sceneStyle, state, ...rest);
    const {stateNavigator: prevStateNavigator} = motionState;
    if (prevStateNavigator !== stateNavigator && stateNavigator.stateContext.state) {
        setMotionState((prevStackState) => {
            const {keys: prevKeys, stateNavigator: prevStateNavigator} = prevStackState;
            const {state, crumbs, nextCrumb} = stateNavigator.stateContext;
            const currentKeys = crumbs.concat(nextCrumb).map(({state: {key}}, i) => `${key}-${i}`);
            const newKeys = currentKeys.slice(prevKeys.length);
            const keys = prevKeys.slice(0, currentKeys.length).concat(newKeys);
            if (prevKeys.length === keys.length || (prevKeys.length > keys.length && prevStateNavigator.stateContext.crumbs[keys.length - 1].state !== state))
                keys[keys.length - 1] = currentKeys[keys.length - 1];
            return {keys, rest: false, stateNavigator, ignorePause: false};
        })
    }
    const {stateContext: {oldState}, stateContext} = stateNavigator;
    renderScene = firstLink ? ({key}) => allScenes[key] : renderScene;
    const {pause, sharedEls} = getSharedElements();
    const {rest, ignorePause} = motionState;
    useEffect(() => {
        const timer = setTimeout(() => {
            setMotionState(prevStackState => ({...prevStackState, ignorePause: true}));
        }, 300);
        return () => clearTimeout(timer);
    }, [pause]);
    const sceneData = getScenes();
    return (stateContext.state &&
        <RSCContext.Provider value={rsc}>
            <SharedElementContext.Provider value={sharedElementRegistry as any}>
                <NavigationAnimation data={sceneData} history={stateContext.history} onRest={clearScene} oldState={oldState} duration={duration} pause={!ignorePause && pause !== null}>
                    {scenes => (
                        scenes.map(({key, subkey, index: crumb, url, unmounted, className, style}) => (
                            <Freeze key={key} enabled={rest && ((crumb < sceneData.length - 1) || unmounted)}>
                                <Scene key={subkey} crumb={crumb} url={url} rest={rest} className={className}
                                    style={{...style, display: unmounted ? 'none' : style?.display}} wrap renderScene={renderScene} />
                            </Freeze>
                        )).concat(
                            <SharedElementAnimation key="sharedElements" sharedElements={!rest ? sharedEls : []}
                                unmountStyle={sceneData[sceneData.length - 1].unmountStyle} duration={duration} />
                        )
                    )}
                </NavigationAnimation>
            </SharedElementContext.Provider>
        </RSCContext.Provider>
    )
}

NavigationStack.Scene = ({children}) => children;

export default NavigationStack;
