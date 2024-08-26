import React from 'react';
import { View } from 'react-native';
import { NavigationMotion, Scene, SharedElementMotion } from 'navigation-react-mobile';
import { MobileHistoryManager } from 'navigation-react-mobile';

const NavigationStack = ({unmountedStyle, mountedStyle, crumbedStyle, unmountStyle = () => null, crumbStyle = () => null,
    sharedElementTransition, duration, renderScene, renderTransition, children}) => {
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
    return (
        <NavigationMotion
            unmountedStyle={unmountedStyle || ((state, data, crumbs) => {
                const trans = returnOrCall(unmountStyle, true, state, data, crumbs);
                return getStyle(trans && typeof trans !== 'string' ? trans : trans ? {type: 'translate', startX: '100%'} : {duration: 0});
            })}
            mountedStyle={mountedStyle || ((state, data, crumbs, _nextState, _nextData, from) => {
                const trans = returnOrCall(from ? unmountStyle : crumbStyle, true, state, data, crumbs);
                return {...emptyStyle, duration: trans && typeof trans !== 'string' ? getStyle(trans).duration : undefined};
            })}
            crumbStyle={crumbedStyle || ((state, data, crumbs, nextState, nextData) => {
                const trans = returnOrCall(crumbStyle, true, state, data, crumbs, nextState, nextData);
                return getStyle(trans && typeof trans !== 'string' ? trans : trans ? {type: 'translate', startX: '0%'} : {duration: 0});
            })}
            sharedElementMotion={sharedElementTransition}
            duration={duration}
            renderScene={renderScene}
            renderMotion={typeof children !== 'function' ? renderTransition || renderMotion : undefined}>
            {typeof children !== 'function' ? cloneScenes(children) : (children || renderMotion)}
        </NavigationMotion>
    );
}

const renderMotion = ({translateX, translateX_pc, translateY, translateY_pc, scaleX, scaleX_pc, scaleY, scaleY_pc, alpha, rotate}, scene, key) => (
    <View key={key}
        style={{
            transform: `
                translate(${translateX ? `${translateX}px` : `${translateX_pc}%`},
                    ${translateY ? `${translateY}px` : `${translateY_pc}%`})
                scale(${scaleX !== 1 ? `${scaleX}` : `${scaleX_pc / 100}`},
                    ${scaleY !== 1 ? `${scaleY}` : `${scaleY_pc / 100}`})
                rotate(${rotate}deg)
			` as any,
            opacity: alpha,
            position: 'absolute',
            backgroundColor: '#fff',
            left: 0, right: 0, top: 0, bottom: 0,
            overflow: 'hidden',
        }}>
        {scene}
    </View>
);

const cloneScenes = (children, nested = false) => (
    React.Children.map(children, scene => (
        (scene.type === Scene || nested)
            ? React.cloneElement(scene, {crumbStyle: scene.props.crumbedStyle})
            : React.cloneElement(scene, null, cloneScenes(scene.props.children, true))
    ))
);

NavigationStack.Scene = Scene;
NavigationStack.HistoryManager = MobileHistoryManager;
NavigationStack.SharedElementTransition = SharedElementMotion;

export default NavigationStack;
