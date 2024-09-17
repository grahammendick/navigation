import React, {useRef, useState, useContext, useEffect, ReactElement, useLayoutEffect} from 'react';
import { State, Crumb, StateNavigator } from 'navigation';
import { NavigationContext } from 'navigation-react';
import Scene from './Scene';
import Freeze from './Freeze';
import { NavigationMotionProps as NavigationStackProps } from './Props';
type NavigationStackState = {stateNavigator: StateNavigator, keys: string[], rest: boolean};

const NavigationStack = ({unmountStyle: unmountStyleStack, crumbStyle: crumbStyleStack, duration = 300, renderScene, children, stackInvalidatedLink, renderMotion = children}: NavigationStackProps) => {
    const {stateNavigator} = useContext(NavigationContext);
    const [motionState, setMotionState] = useState<NavigationStackState>({stateNavigator: null, keys: [], rest: false});
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
    const clearScene = (index) => {
        setMotionState(({rest: prevRest, stateNavigator, keys}) => {
            const scene = getScenes().filter(scene => scene.key === index)[0];
            var rest = prevRest || (scene && scene.mount);
            return {rest, stateNavigator, keys};
        });
    }
    const getScenes = () => {
        const {keys} = motionState;
        const {crumbs, nextCrumb} = stateNavigator.stateContext;
        return crumbs.concat(nextCrumb).map(({state, data, url}, index, crumbsAndNext) => {
            const preCrumbs = crumbsAndNext.slice(0, index);
            const {state: nextState, data: nextData} = crumbsAndNext[index + 1] || {state: undefined, data: undefined};
            const mount = url === nextCrumb.url;
            return {key: keys[index], index, mount, unmountStyle: unmountStyle(state, data, preCrumbs), crumbStyle: crumbStyle(state, data, preCrumbs, nextState, nextData)};
        });
    }
    const sceneProps = ({key}: State) => firstLink ? allScenes[key].props : null;
    const returnOrCall = (item, ...args) => typeof item !== 'function' ? item : item(...args);
    const unmountStyle = (state, ...rest) => sceneProps(state)?.unmountStyle ? returnOrCall(sceneProps(state)?.unmountStyle, ...rest) : returnOrCall(unmountStyleStack, state, ...rest);
    const crumbStyle = (state, ...rest) => sceneProps(state)?.crumbStyle ? returnOrCall(sceneProps(state)?.crumbStyle, ...rest) : returnOrCall(crumbStyleStack, state, ...rest);
    const {stateNavigator: prevStateNavigator} = motionState;
    if (prevStateNavigator !== stateNavigator && stateNavigator.stateContext.state) {
        setMotionState((prevStackState) => {
            const {keys: prevKeys, stateNavigator: prevStateNavigator} = prevStackState;
            const {state, crumbs, nextCrumb} = stateNavigator.stateContext;
            const prevState = prevStateNavigator && prevStateNavigator.stateContext.state;
            const currentKeys = crumbs.concat(nextCrumb).reduce((arr, {state: {key}}) => {
                const prevKey = arr[arr.length - 1];
                return [...arr, `${prevKey ? `${prevKey}->` : ''}${key.replace(/-/g, '-|')}`]
            }, []);
            const newKeys = currentKeys.slice(prevKeys.length);
            const keys = prevKeys.slice(0, currentKeys.length).concat(newKeys);
            if (prevKeys.length === keys.length && prevState !== state)
                keys[keys.length - 1] = currentKeys[keys.length - 1];
            return {keys, rest: false, stateNavigator};
        })
    }
    const {stateContext: {oldState}, stateContext} = stateNavigator;
    renderScene = firstLink ? ({key}) => allScenes[key] : renderScene;
    return (stateContext.state &&
        <Animator data={getScenes()} onRest={({key}) => clearScene(key)} oldState={oldState} duration={duration}>
            {scenes => (
                scenes.map(({key, index: crumb}) => (
                    <Freeze key={key} enabled={motionState.rest && crumb < getScenes().length - 1}>
                        <Scene crumb={crumb} id={key} rest renderScene={renderScene} />
                    </Freeze>
                ))
            )}
        </Animator>
    )
}

const Animator  = ({children, data: nextScenes, onRest, oldState, duration: defaultDuration}) => {
    const [scenes, setScenes] = useState({prev: null, all: [], count: 0});
    const container = useRef(null);
    useLayoutEffect(() => {
        let cancel = false;
        scenes.all.forEach(({key, pushEnter, popExit, pushExit, popEnter, unmountStyle, crumbStyle}, i) => {
            const scene = container.current.children[i];
            const prevNavState = scene.navState || scene.prevNavState;
            if (!scene.animate) {
                if (popExit)
                    setScenes(({all, ...rest}) => ({all: all.filter((_s, index) => index !== i), ...rest}))
                if (pushEnter && prevNavState !== 'pushEnter')
                    onRest({key})
                scene.prevNavState = pushEnter ? 'pushEnter' : popExit ? 'popExit' : 'popEnter';
                return;
            };
            const afterPushEnter = scene.pushEnter?.finished || {then: (f) => f()};
            const afterPopEnter = scene.popEnter?.finished || {then: (f) => f()};
            afterPopEnter.then(() => {
                if (cancel) return;
                if (!scene.pushEnter) {
                    const {duration = defaultDuration, keyframes = unmountStyle} = unmountStyle;
                    scene.pushEnter = scene.animate(keyframes, {duration, fill: 'forwards'});
                    scene.pushEnter.persist();
                }
                if (pushEnter && prevNavState !== 'pushEnter') {
                    scene.navState = 'pushEnter';
                    if (oldState) {
                        if (prevNavState === 'popExit') scene.pushEnter.reverse();
                        else if (prevNavState) scene.pushEnter.finish();
                        else scene.pushEnter.play();
                    } else {
                        scene.pushEnter.finish();
                    }
                }
                if (popExit && prevNavState !== 'popExit') {
                    scene.navState = 'popExit';
                    scene.pushEnter.reverse();
                }
                scene.pushEnter?.finished.then(() => {
                    if (cancel || !scene.navState) return;
                    if (popExit)
                        setScenes(({all, ...rest}) => ({all: all.filter((_s, index) => index !== i), ...rest}))
                    if (pushEnter || popExit) {
                        onRest({key});
                        scene.prevNavState = scene.navState;
                        scene.navState = undefined;
                    }
                });
            });
            afterPushEnter.then(() => {
                if (cancel) return;
                if (!scene.popEnter && (pushExit || popEnter)) {       
                    const {duration = defaultDuration, keyframes = crumbStyle} = crumbStyle;
                    scene.popEnter = scene.animate(keyframes, {duration, fill: 'backwards'});
                    scene.popEnter.persist();
                }
                if (popEnter && prevNavState !== 'popEnter') {
                    scene.navState = 'popEnter';
                    if (prevNavState === 'pushExit') scene.popEnter.reverse();
                    else if (prevNavState) scene.popEnter.finish();
                    else scene.popEnter.play();
                }
                if (pushExit && prevNavState !== 'pushExit') {
                    scene.navState = 'pushExit';
                    scene.popEnter.reverse();
                }
                scene.popEnter?.finished.then(() => {
                    if (cancel || !scene.navState) return;
                    if (pushExit || popEnter) {
                        onRest({key});
                        scene.prevNavState = scene.navState;
                        scene.navState = undefined;
                    }
                });
            });
        });
        return () => {cancel = true;}
    }, [scenes]);
    if (nextScenes !== scenes.prev) {
        setScenes(({all: scenes, count}) => {
            const scenesByKey = scenes.reduce((acc, scene) => ({...acc, [scene.key]: scene}), {});
            const nextScenesByKey = nextScenes.reduce((acc, scene) => ({...acc, [scene.key]: scene}), {});
            const noAnim = {pushEnter: false, pushExit: false, popEnter: false, popExit: false};
            return {
                prev: nextScenes,
                count: count + 1,
                all: nextScenes
                    .map((nextScene) => {
                        const scene = scenesByKey[nextScene.key];
                        const isMounted = nextScene.index === nextScenes.length - 1;
                        const wasMounted = !!scene?.pushEnter || !!scene?.popEnter;
                        const noAnimScene = {...scene, ...nextScene, ...noAnim};
                        if (!scene) return {...noAnimScene, pushEnter: true, count};
                        if (isMounted && !wasMounted) return {...noAnimScene, popEnter: !scene.popExit, pushEnter: scene.popExit};
                        if (!isMounted && wasMounted) return {...noAnimScene, pushExit: true};
                        return {...scene, ...nextScene};
                    })
                    .concat(scenes
                        .filter(scene => !nextScenesByKey[scene.key])
                        .map(scene => ({...scene, ...noAnim, popExit: true}))
                    )
                    .sort((a, b) => a.index !== b.index ? a.index - b.index : a.count - b.count)
            };
        });
    };
    return <div ref={container}>{children(scenes.all)}</div>;
}

NavigationStack.Scene = ({children}) => children;

export default NavigationStack;
