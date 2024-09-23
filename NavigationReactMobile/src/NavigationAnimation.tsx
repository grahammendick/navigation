import React, {useRef, useState, useLayoutEffect} from 'react';

const NavigationAnimation  = ({children, data: nextScenes, onRest, oldState, duration: defaultDuration, pause}) => {
    const [scenes, setScenes] = useState({prev: null, all: [], count: 0});
    const container = useRef(null);
    useLayoutEffect(() => {
        let cancel = false;
        scenes.all.forEach(({key, url, pushEnter, popExit, pushExit, popEnter, unmountStyle, crumbStyle}, i) => {
            const scene = container.current.children[i];
            const prevNavState = scene.navState || scene.prevNavState;
            if (!scene.animate) {
                if (popExit) setScenes(({all, ...rest}) => ({all: all.filter((_s, index) => index !== i), ...rest}));
                if ((pushEnter && prevNavState !== 'pushEnter') || (popEnter && prevNavState !== 'popEnter')) onRest({key, url});
                scene.prevNavState = pushEnter ? 'pushEnter' : popExit ? 'popExit' : pushExit ? 'pushExit' : 'popEnter';
                return;
            };
            if (scene.pushPlayState) scene.pushEnter.play();
            if (scene.popPlayState) scene.popEnter.play();
            const afterPushEnter = scene.pushEnter?.finished || {then: (f) => f()};
            const afterPopEnter = scene.popEnter?.finished || {then: (f) => f()};
            afterPopEnter.then(() => {
                if (cancel || !unmountStyle) return;
                if (!scene.pushEnter) {
                    const {duration = defaultDuration, keyframes = unmountStyle} = unmountStyle;
                    if (!duration || !keyframes) return;
                    scene.pushEnter = scene.animate(keyframes, {duration, fill: 'forwards'});
                    scene.pushEnter.persist();
                }
                if (pushEnter && prevNavState !== 'pushEnter') {
                    scene.navState = 'pushEnter';
                    if (prevNavState === 'popExit') scene.pushEnter.reverse();
                    else if (prevNavState) scene.pushEnter.finish();
                    else scene.pushEnter.play();
                    if (!oldState) scene.pushEnter.finish();
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
                        onRest({key, url});
                        scene.prevNavState = scene.navState;
                        scene.navState = undefined;
                    }
                });
                scene.pushPlayState = undefined;
                if (pause && scene.pushEnter?.playState === 'running') {
                    scene.pushPlayState = 'running';
                    scene.pushEnter.pause();
                }
            });
            afterPushEnter.then(() => {
                if (cancel || !crumbStyle) return;
                if (!scene.popEnter && (pushExit || popEnter)) {       
                    const {duration = defaultDuration, keyframes = crumbStyle} = crumbStyle;
                    if (!duration || !keyframes) return;
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
                    if (!oldState) scene.popEnter.finish();
                }
                scene.popEnter?.finished.then(() => {
                    if (cancel || !scene.navState) return;
                    if (pushExit || popEnter) {
                        onRest({key, url});
                        scene.prevNavState = scene.navState;
                        scene.navState = undefined;
                    }
                });
                scene.popPlayState = undefined;
                if (pause && scene.popEnter?.playState === 'running') {
                    scene.popPlayState = 'running';
                    scene.popEnter.pause();
                }
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
                        const wasMounted = !!scene?.pushEnter || !!scene?.popEnter;
                        const noAnimScene = {...scene, ...nextScene, ...noAnim};
                        if (!scene) return {...noAnimScene, pushEnter: true, count};
                        if (nextScene.mount && !wasMounted) return {...noAnimScene, popEnter: !scene.popExit, pushEnter: scene.popExit};
                        if (!nextScene.mount && wasMounted) return {...noAnimScene, pushExit: true};
                        return {...scene, ...nextScene};
                    })
                    .concat(scenes
                        .filter(({key, unmountStyle}) => (
                            !nextScenesByKey[key] && Array.isArray(unmountStyle?.keyframes || unmountStyle) && (unmountStyle.duration ?? defaultDuration)
                        ))
                        .map(scene => ({...scene, ...noAnim, popExit: !scene.pushExit, popEnter: scene.pushExit}))
                    )
                    .sort((a, b) => a.index !== b.index ? a.index - b.index : a.count - b.count)
            };
        });
    };
    return (
        <div ref={container} style={{display: 'flex', flexDirection: 'column', flex: 1}}>
            {children(scenes.all)}
        </div>
    );
}

export default NavigationAnimation;
