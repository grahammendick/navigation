import React from 'react';
import { View } from 'react-native';
import { NavigationMotion, NavigationStack as NavigationMobileStack, Scene, SharedElementMotion } from 'navigation-react-mobile';
import { MobileHistoryManager } from 'navigation-react-mobile';

const NavigationStack = ({unmountedStyle, mountedStyle, crumbedStyle, unmountStyle = () => null, crumbStyle = () => null,
    sharedElementTransition, duration, style, className, renderScene, renderTransition, children}) => {
    const useStack = !sharedElementTransition && !!NavigationMobileStack;
    const Stack = useStack ? NavigationMobileStack : NavigationMotion as any;
    return (
        <Stack
            unmountedStyle={unmountedStyle || ((state, data, crumbs) => {
                const trans = returnOrCall(unmountStyle, true, state, data, crumbs);
                return getStyle(trans && typeof trans !== 'string' ? trans : trans ? {type: 'translate', startX: '100%'} : {duration: 0});
            })}
            mountedStyle={mountedStyle || ((state, data, crumbs, _nextState, _nextData, from) => {
                const trans = returnOrCall(from ? unmountStyle : crumbStyle, true, state, data, crumbs);
                return {...emptyStyle, duration: trans && typeof trans !== 'string' ? getStyle(trans).duration : undefined};
            })}
            unmountStyle={unmountedStyle || ((state, data, crumbs) => {
                const trans = returnOrCall(unmountStyle, true, state, data, crumbs);
                const style = getStyle(trans && typeof trans !== 'string' ? trans : trans ? {type: 'translate', startX: '100%'} : {duration: 0});
                return useStack ? getKeyframes(style) : style;
            })}
            crumbStyle={crumbedStyle || ((state, data, crumbs, nextState, nextData) => {
                const trans = returnOrCall(crumbStyle, true, state, data, crumbs, nextState, nextData);
                const style = getStyle(trans && typeof trans !== 'string' ? trans : trans ? {type: 'translate', startX: '0%'} : {duration: 0});
                return useStack ? getKeyframes(style) : style;
            })}
            sharedElementMotion={sharedElementTransition}
            duration={duration}
            style={style}
            className={className}
            renderScene={renderScene}
            renderMotion={typeof children !== 'function' ? renderTransition || renderMotion : undefined}>
            {typeof children !== 'function' ? cloneScenes(children, !useStack && renderTransition, useStack) : (children || renderMotion)}
        </Stack>
    );
}

const renderMotion = (style, scene, key) => (
    <View key={key}
        style={{
            transform: getTransform(style) as any,
            opacity: style.alpha,
            position: 'fixed' as any,
            backgroundColor: '#fff',
            left: 0, right: 0, top: 0, bottom: 0,
            overflow: 'hidden' as any,
        }}>
        {scene}
    </View>
);

const getTransform = ({translateX, translateX_pc, translateY, translateY_pc, scaleX, scaleX_pc, scaleY, scaleY_pc, rotate}) => (
    `translate(${translateX ? `${translateX}px` : `${translateX_pc}%`},
        ${translateY ? `${translateY}px` : `${translateY_pc}%`})
    scale(${scaleX !== 1 ? `${scaleX}` : `${scaleX_pc / 100}`},
        ${scaleY !== 1 ? `${scaleY}` : `${scaleY_pc / 100}`})
    rotate(${rotate}deg)`    
);

const getKeyframes = (style) => ({
    duration: style.duration,
    keyframes: [
        {transform: `${getTransform(style)}`, opacity: style.alpha},
        {transform: 'translate(0, 0) scale(1, 1) rotate(0)', opacity: 1}
    ]
});

const emptyStyle = {duration: undefined, translateX: 0, translateX_pc: 0, translateY: 0, translateY_pc: 0,
    scaleX: 1, scaleX_pc: 100, scaleY: 1, scaleY_pc: 100, alpha: 1, rotate: 0};

const returnOrCall = (item, ...args) => typeof item !== 'function' ? item : item(...args);

const getStyle = (trans) => {
    trans = !Array.isArray(trans) ? trans : {items: trans};
    const transStyle = {...emptyStyle};
    const addStyle = (type: string, start: string | number) => {
        if (start === undefined) return;
        const suffix = `${start}`.endsWith('%') ? '_pc' : '';
        transStyle[type + suffix] = +(suffix ? `${start}`.slice(0, -1) : start);
    }
    const convertTrans = ({type, start, from, startX, fromX, startY, fromY, items, duration}) => {
        if (type === 'translate' || type === 'scale') addStyle(`${type}X`, startX ?? fromX);
        if (type === 'translate' || type === 'scale') addStyle(`${type}Y`, startY ?? fromY);
        if (type === 'alpha' || type === 'rotate') addStyle(type, start ?? from);
        if (duration !== undefined) transStyle.duration = Math.max(duration, transStyle.duration || 0);
        items?.forEach(convertTrans);
    };
    convertTrans(trans);
    return transStyle;
}

const cloneScenes = (children, customRender, useStack, nested = false) => (
    React.Children.map(children, scene => {
        const {unmountedStyle, crumbedStyle, unmountStyle, crumbStyle, children} = scene.props;
        return (
            (scene.type === Scene || nested)
                ? React.cloneElement(scene, {
                    unmountedStyle: unmountedStyle || (!customRender && unmountStyle ? ((data, crumbs) => {
                        const trans = returnOrCall(unmountStyle, true, data, crumbs);
                        return getStyle(trans && typeof trans !== 'string' ? trans : trans ? {type: 'translate', startX: '100%'} : {duration: 0});
                    }) : undefined),
                    unmountStyle: unmountStyle ? ((state, data, crumbs) => {
                        const trans = returnOrCall(unmountStyle, true, state, data, crumbs);
                        const style = getStyle(trans && typeof trans !== 'string' ? trans : trans ? {type: 'translate', startX: '100%'} : {duration: 0});
                        return getKeyframes(style);
                    }) : undefined,
                    crumbStyle: crumbedStyle || (!customRender && crumbStyle ? ((data, crumbs, nextState, nextData) => {
                        const trans = returnOrCall(crumbStyle, true, data, crumbs, nextState, nextData);
                        const style = getStyle(trans && typeof trans !== 'string' ? trans : trans ? {type: 'translate', startX: '0%'} : {duration: 0});
                        return useStack ? getKeyframes(style) : style;
                    }) : undefined),
                })
                : React.cloneElement(scene, null, cloneScenes(children, customRender, useStack, true))
        )
    })
);

NavigationStack.Scene = Scene;
NavigationStack.HistoryManager = MobileHistoryManager;
NavigationStack.SharedElementTransition = SharedElementMotion;

export default NavigationStack;
