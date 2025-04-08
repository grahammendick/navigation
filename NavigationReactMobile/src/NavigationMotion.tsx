'use client'
import React, {useRef, useState, useContext, useEffect, ReactElement} from 'react';
import { State, Crumb, StateNavigator } from 'navigation';
import { NavigationContext } from 'navigation-react';
import Motion from './Motion.js';
import Scene from './Scene.js';
import SharedElementContext from './SharedElementContext.js';
import SharedElementRegistry from './SharedElementRegistry.js';
import Freeze from './Freeze.js';
import NavigationStack from './NavigationStack.js';
import { NavigationMotionProps } from './Props.js';
type NavigationMotionState = {stateNavigator: StateNavigator, keys: string[]};
type SceneContext = {key: string, state: State, data: any, url: string, crumbs: Crumb[], nextState: State, nextData: any, mount: boolean, fromUnmounted: boolean};
type MotionStyle = {style: any, data: SceneContext, key: string, rest: boolean, progress: number, start: any, end: any };

const NavigationMotion = ({unmountedStyle: unmountedStyleStack, mountedStyle: mountedStyleStack, crumbStyle: crumbStyleStack, duration = 300,
    sharedElementMotion, renderScene, children, stackInvalidatedLink, renderMotion = children}: NavigationMotionProps) => {
    const sharedElementRegistry = useRef(new SharedElementRegistry());
    const {stateNavigator} = useContext(NavigationContext);
    const [motionState, setMotionState] = useState<NavigationMotionState>({stateNavigator: null, keys: []});
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
    const getSharedElements = () => {
        const {url, oldUrl} = stateNavigator.stateContext;
        if (oldUrl !== null) {
            return sharedElementRegistry.current.getSharedElements(url, oldUrl);
        }
        return [];
    }
    const clearScene = (url) => {
        const scene = getScenes().filter(scene => scene.url === url)[0];
        if (!scene)
            sharedElementRegistry.current.unregisterSharedElement(url);
    }
    const getScenes: () => SceneContext[] = () => {
        const {keys} = motionState;
        const {crumbs, nextCrumb, oldUrl} = stateNavigator.stateContext;
        const backward = oldUrl && oldUrl.split('crumb=').length > crumbs.length + 1;
        return crumbs.concat(nextCrumb).map(({state, data, url}, index, crumbsAndNext) => {
            const preCrumbs = crumbsAndNext.slice(0, index);
            const {state: nextState, data: nextData} = crumbsAndNext[index + 1] || {state: undefined, data: undefined};
            const mount = url === nextCrumb.url;
            const fromUnmounted = mount && !backward;
            return {key: keys[index], state, data, url, crumbs: preCrumbs, nextState, nextData, mount, fromUnmounted };
        });
    }
    const sceneProps = ({key}: State) => firstLink ? allScenes[key].props : null;
    const returnOrCall = (item, ...args) => typeof item !== 'function' ? item : item(...args);
    const unmountedStyle = (state, ...rest) => sceneProps(state)?.unmountedStyle ? returnOrCall(sceneProps(state)?.unmountedStyle, ...rest) : returnOrCall(unmountedStyleStack, state, ...rest);
    const mountedStyle = (state, ...rest) => sceneProps(state)?.mountedStyle ? returnOrCall(sceneProps(state)?.mountedStyle, ...rest) : returnOrCall(mountedStyleStack, state, ...rest);
    const crumbStyle = (state, ...rest) => sceneProps(state)?.crumbStyle ? returnOrCall(sceneProps(state)?.crumbStyle, ...rest) : returnOrCall(crumbStyleStack, state, ...rest);
    const getStyle = (mounted: boolean, {state, data, crumbs, nextState, nextData, mount, fromUnmounted}: SceneContext) => {
        const styleProp = !mounted ? unmountedStyle : (mount ? mountedStyle : crumbStyle);
        fromUnmounted = (mounted && mount) ? fromUnmounted : undefined;
        return {...styleProp(state, data, crumbs, nextState, nextData, fromUnmounted)};
    }
    const getMotion = (styles: MotionStyle[]) => {
        let moving = false, mountMoving = false, mountDuration: number, mountProgress: number;
        for(const {rest, progress, data: {mount}, style: {duration}} of styles) {
            if (mount) {
                mountMoving = !rest;
                mountDuration = duration;
                mountProgress = progress;
            }
            moving = moving || !rest;
        }
        return {rest: !moving, mountRest: !mountMoving, mountDuration, mountProgress};
    }
    const {stateNavigator: prevStateNavigator} = motionState;
    if (prevStateNavigator !== stateNavigator && stateNavigator.stateContext.state) {
        setMotionState((prevStackState) => {
            const {keys: prevKeys, stateNavigator: prevStateNavigator} = prevStackState;
            const {state, crumbs, nextCrumb} = stateNavigator.stateContext;
            const prevState = prevStateNavigator && prevStateNavigator.stateContext.state;
            const currentKeys = crumbs.concat(nextCrumb).map((_, i) => '' + i);
            const newKeys = currentKeys.slice(prevKeys.length);
            const keys = prevKeys.slice(0, currentKeys.length).concat(newKeys);
            if (prevKeys.length === keys.length && prevState !== state)
                keys[keys.length - 1] += '+';
            return {keys, stateNavigator};    
        })
    }
    const {stateContext: {crumbs, oldState}, stateContext} = stateNavigator;
    renderScene = firstLink ? ({key}) => allScenes[key] : renderScene;
    return (stateContext.state &&
        <SharedElementContext.Provider value={sharedElementRegistry.current}>
            <Motion<SceneContext>
                data={getScenes()}
                getKey={({key}) => key}
                enter={scene => getStyle(!oldState, scene)}
                update={scene => getStyle(true, scene)}
                leave={scene => getStyle(false, scene)}
                onRest={({url}) => clearScene(url)}
                duration={duration}>
                {styles => {
                    const {rest, mountRest, mountDuration, mountProgress} = getMotion(styles);
                    return (
                        styles.map(({data: {key, url, state, data}, style: {duration, ...style}}) => {
                            const crumb = +key.replace(/\++$/, '');
                            const scene = <Scene crumb={crumb} url={url} rest={rest} renderScene={renderScene} />;
                            return (
                                <Freeze key={key} enabled={rest && crumb < getScenes().length - 1}>
                                    {renderMotion(style, scene, key, crumbs.length === crumb, state, data)}
                                </Freeze>
                            );
                        }).concat(
                            sharedElementMotion && sharedElementMotion({
                                key: 'sharedElements',
                                sharedElements: !mountRest ? getSharedElements() : [],
                                progress: mountProgress,
                                duration: mountDuration ?? duration,
                            })
                        )
                    )}
                }
            </Motion>
        </SharedElementContext.Provider>
    )
}

export default NavigationMotion;
