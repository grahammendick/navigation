import React, {useRef, useState, useContext} from 'react';
import { State, Crumb, StateNavigator } from 'navigation';
import { NavigationContext } from 'navigation-react';
import Motion from './Motion';
import Scene from './Scene';
import SharedElementContext from './SharedElementContext';
import SharedElementRegistry from './SharedElementRegistry';
import Freeze from './Freeze';
import { NavigationMotionProps } from './Props';
type NavigationMotionState = {stateNavigator: StateNavigator, keys: string[]};
type SceneContext = {key: string, state: State, data: any, url: string, crumbs: Crumb[], nextState: State, nextData: any, mount: boolean, fromUnmounted: boolean};
type MotionStyle = {style: any, data: SceneContext, key: string, rest: boolean, progress: number, start: any, end: any };

const NavigationMotion = ({unmountedStyle, mountedStyle, crumbStyle, duration = 300,
    sharedElementMotion, renderScene, children}: NavigationMotionProps) => {
    const sharedElementRegistry = useRef(new SharedElementRegistry());
    const {stateNavigator} = useContext(NavigationContext);
    const [motionState, setMotionState] = useState<NavigationMotionState>({stateNavigator: null, keys: []});
    const getSharedElements = () => {
        const {crumbs, oldUrl} = stateNavigator.stateContext;
        if (oldUrl !== null) {
            const oldScene = oldUrl.split('crumb=').length - 1;
            return sharedElementRegistry.current.getSharedElements(crumbs.length, oldScene);
        }
        return [];
    }
    const clearScene = (index) => {
        const scene = getScenes().filter(scene => scene.key === index)[0];
        if (!scene)
            sharedElementRegistry.current.unregisterSharedElement(index);
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
    const getStyle = (mounted: boolean, {state, data, crumbs, nextState, nextData, mount, fromUnmounted}: SceneContext) => {
        const styleProp = !mounted ? unmountedStyle : (mount ? mountedStyle : crumbStyle);
        fromUnmounted = (mounted && mount) ? fromUnmounted : undefined;
        const style = typeof styleProp === 'function' ? styleProp(state, data, crumbs, nextState, nextData, fromUnmounted) : styleProp;
        return {...style, __marker: !mounted ? 1 : (mount ? 0 : -1)};
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
    const {keys: prevKeys, stateNavigator: prevStateNavigator} = motionState;
    if (prevStateNavigator !== stateNavigator) {
        setMotionState(() => {
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
    return (stateContext.state &&
        <SharedElementContext.Provider value={sharedElementRegistry.current}>
            <Motion<SceneContext>
                data={getScenes()}
                getKey={({key}) => key}
                enter={scene => getStyle(!oldState, scene)}
                update={scene => getStyle(true, scene)}
                leave={scene => getStyle(false, scene)}
                onRest={({key}) => clearScene(key)}
                duration={duration}>
                {styles => {
                    const {rest, mountRest, mountDuration, mountProgress} = getMotion(styles);
                    return (
                        styles.map(({data: {key, state, data}, style: {__marker, duration, ...style}}) => {
                            const crumb = +key.replace(/\++$/, '');
                            const scene = <Scene crumb={crumb} rest={rest} renderScene={renderScene} />;
                            return (
                                <Freeze key={key} enabled={rest && crumb < getScenes().length - 1}>
                                    {children(style, scene, key, crumbs.length === crumb, state, data)}
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
