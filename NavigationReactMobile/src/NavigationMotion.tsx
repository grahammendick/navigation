import React, {useRef, useState, useContext, useEffect, ReactElement, useLayoutEffect} from 'react';
import { State, Crumb, StateNavigator } from 'navigation';
import { NavigationContext } from 'navigation-react';
import Motion from './Motion';
import Scene from './Scene';
import SharedElementContext from './SharedElementContext';
import SharedElementRegistry from './SharedElementRegistry';
import Freeze from './Freeze';
import { NavigationMotionProps } from './Props';
type NavigationMotionState = {stateNavigator: StateNavigator, keys: string[], rest: boolean};
type SceneContext = {key: string, state: State, data: any, url: string, crumbs: Crumb[], nextState: State, nextData: any, mount: boolean, fromUnmounted: boolean};
type MotionStyle = {style: any, data: SceneContext, key: string, rest: boolean, progress: number, start: any, end: any };

const NavigationMotion = ({unmountedStyle: unmountedStyleStack, mountedStyle: mountedStyleStack, crumbStyle: crumbStyleStack, duration = 300,
    sharedElementMotion, renderScene, children, stackInvalidatedLink, renderMotion = children}: NavigationMotionProps) => {
    const sharedElementRegistry = useRef(new SharedElementRegistry());
    const {stateNavigator} = useContext(NavigationContext);
    const [motionState, setMotionState] = useState<NavigationMotionState>({stateNavigator: null, keys: [], rest: false});
    const scenes = {};
    let firstLink;
    const findScenes = (elements = children, nested = false) => {
        for(const scene of React.Children.toArray(elements) as ReactElement<any>[]) {
            const {stateKey, children} = scene.props;
            if (scene.type === NavigationMotion.Scene) {
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
        const {crumbs, oldUrl} = stateNavigator.stateContext;
        if (oldUrl !== null) {
            const oldScene = oldUrl.split('crumb=').length - 1;
            return sharedElementRegistry.current.getSharedElements(crumbs.length, oldScene);
        }
        return [];
    }
    const clearScene = (index) => {
        setMotionState(({rest: prevRest, stateNavigator, keys}) => {
            const scene = getScenes().filter(scene => scene.key === index)[0];
            if (!scene)
                sharedElementRegistry.current.unregisterSharedElement(index);
            var rest = prevRest || (scene && scene.mount);
            return {rest, stateNavigator, keys};
        });
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
            return {key: keys[index], index, state, data, url, crumbs: preCrumbs, nextState, nextData, mount, fromUnmounted };
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
            return {keys, rest: false, stateNavigator};    
        })
    }
    const {stateContext: {crumbs, oldState}, stateContext} = stateNavigator;
    renderScene = firstLink ? ({key}) => allScenes[key] : renderScene;
    return (stateContext.state &&
        <SharedElementContext.Provider value={sharedElementRegistry.current}>
            <Animator data={getScenes()} onRest={({key}) => clearScene(key)} oldState={!oldState}>
                {scenes => {
                    // const {rest, mountRest, mountDuration, mountProgress} = getMotion(styles);
                    return (
                        scenes.map(({key, state, data}) => {
                            const crumb = +key.replace(/\++$/, '');
                            const scene = <Scene crumb={crumb} rest renderScene={renderScene} />;
                            return (
                                <Freeze key={key} enabled={motionState.rest && crumb < getScenes().length - 1}>
                                    <div id={key} key={key} className="scene">
                                        {scene}
                                    </div>
                                </Freeze>
                            );
                        })
                    )}
                }
            </Animator>
        </SharedElementContext.Provider>
    )
}

const Animator  = ({children, data: nextScenes, onRest, oldState}) => {
    const [scenes, setScenes] = useState({prev: null, all: []});
    const container = useRef(null);
    // Need to animate it after finish promise resolves, for example,
    // so can do popEnter then popExit after 2 browser backs in a row
    // or pushEnter then pushExit after 2 browser forwards in a row
    // Test this on twitter sample because need deep stack
    useLayoutEffect(() => {
        let cancel = false;
        scenes.all.forEach(({key, pushEnter, popExit, pushExit, popEnter}, i) => {
            const scene = container.current.children[i];
            const prevNavState = scene.navState || scene.prevNavState;
            if (!scene.animate) {
                if (popExit)
                    setScenes(({prev, all}) => ({prev, all: all.filter((_s, index) => index !== i)}))
                if (pushEnter && prevNavState !== 'pushEnter')
                    onRest({key})
                scene.prevNavState = pushEnter ? 'pushEnter' : popExit ? 'popExit' : 'popEnter';
                return;
            };
            if (pushEnter && prevNavState !== 'pushEnter') {
                if (!scene.pushEnter) {
                    scene.pushEnter = scene.animate(
                        [
                            {transform: 'translateX(100%)'},
                            {transform: 'translateX(0)'}
                        ],
                        {duration: 1000, fill: 'forwards'},
                    );
                    scene.pushEnter.persist();
                }
                scene.navState = 'pushEnter';
                if (!oldState) {
                    if (prevNavState !== 'popExit') scene.pushEnter.play();
                    else scene.pushEnter.reverse();
                } else {
                    scene.pushEnter.finish();
                }
            }
            if (popExit && prevNavState !== 'popExit') {
                scene.navState = 'popExit';
                scene.pushEnter.reverse();
            }
            if (!scene.popEnter && (pushExit || popEnter)) {
                scene.popEnter = scene.animate(
                    [
                        {transform: 'translateX(5%) scale(0.8)', opacity: 0},
                        {transform: 'translateX(0) scale(1)', opacity: 1}
                    ],
                    {duration: 1000, fill: 'backwards'},
                );
                scene.popEnter.persist();
            }
            if (pushExit && prevNavState !== 'pushExit') {
                scene.navState = 'pushExit';
                if (prevNavState !== 'popEnter') scene.popEnter.reverse();
                else scene.popEnter.reverse();
            }
            if (popEnter && prevNavState !== 'popEnter') {
                scene.navState = 'popEnter';
                if (prevNavState) scene.popEnter.reverse();
                else scene.popEnter.play();
            }
            scene.pushEnter?.finished.then(() => {
                if (cancel || !scene.navState) return;
                if (popExit)
                    setScenes(({prev, all}) => ({prev, all: all.filter((_s, index) => index !== i)}))
                if (pushEnter || popExit) {
                    onRest({key});
                    scene.prevNavState = scene.navState;
                    scene.navState = undefined;
                }
            });
            scene.popEnter?.finished.then(() => {
                if (cancel || !scene.navState) return;
                if (pushExit || popEnter) {
                    onRest({key});
                    scene.prevNavState = scene.navState;
                    scene.navState = undefined;
                }
            });
        });
        return () => {cancel = true;}
    }, [scenes]);
    if (nextScenes !== scenes.prev) {
        setScenes(({all: scenes}) => {
            const scenesByKey = scenes.reduce((acc, scene) => ({...acc, [scene.key]: scene}), {});
            const nextScenesByKey = nextScenes.reduce((acc, scene) => ({...acc, [scene.key]: scene}), {});
            const noAnim = {pushEnter: false, pushExit: false, popEnter: false, popExit: false};
            return {
                prev: nextScenes,
                all: nextScenes
                    .map((nextScene) => {
                        const scene = scenesByKey[nextScene.key];
                        const isMounted = nextScene.index === nextScenes.length - 1;
                        const wasMounted = !!scene?.pushEnter || !!scene?.popEnter;
                        const noAnimScene = {...nextScene, ...noAnim};
                        if (isMounted && !wasMounted && !scene) return {...noAnimScene, pushEnter: true};
                        if (isMounted && !wasMounted && scene && !scene.popExit) return {...noAnimScene, popEnter: true};
                        if (isMounted && !wasMounted && scene && scene.popExit) return {...noAnimScene, pushEnter: true};
                        if (!isMounted && wasMounted && scene) return {...noAnimScene, pushExit: true};
                        return {...scene, ...nextScene};
                    })
                    .concat(scenes
                        .filter(scene => !nextScenesByKey[scene.key])
                        .map(scene => ({...scene, ...noAnim, popExit: true}))
                    )
                    .sort((a, b) => a.index !== b.index ? a.index - b.index : a.key.length - b.key.length)
                    // might need to fix index - test replace navigation and see if sorted correctly
                    // maybe need to take index from scene or nextScene?
            };
        });
    };
    return <div ref={container}>{children(scenes.all)}</div>;
}

NavigationMotion.Scene = ({children}) => children;

export default NavigationMotion;
