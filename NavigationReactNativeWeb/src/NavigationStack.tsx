import React from 'react';
import { View } from 'react-native';
import { NavigationMotion, Scene, SharedElementMotion } from 'navigation-react-mobile';
import { MobileHistoryManager } from 'navigation-react-mobile';

const NavigationStack = ({unmountedStyle, mountedStyle, crumbedStyle, unmountStyle = () => null, crumbStyle = () => null,
  sharedElementTransition, duration, renderScene, renderTransition, children}) => {
  const customRender = typeof children === 'function' || renderTransition;
  // if !customRender then turn unmountStyle into unmounted style (and mountedStyle)
  // and crumbStyle into crumbStyle
  // (what about if they're empty like in the zoom sample?)
  const returnOrCall = (item, ...args) => typeof item !== 'function' ? item : item(...args);
  return (
      <NavigationMotion
          unmountedStyle={unmountedStyle || ((state, data, crumbs) => {
            let trans = returnOrCall(unmountStyle, true, state, data, crumbs);
            if (!trans || typeof trans === 'string')
              trans = {type: 'translate',  startX: 100};
            trans = !Array.isArray(trans) ? trans : {items: trans};
            const transStyle = {duration, translateX: 0, translateX_pc: 0, scaleX: 1, scaleX_pc: 100, alpha: 1};
            const addStyle = (type: string, start: string | number) => {
              if (start === undefined) return;
              const percent = typeof start === 'string' && start.endsWith('%')
              transStyle[type + (percent ? '_pc' : '')] = percent ? +(start as string).slice(0, -1) : +start;
            }
            const convertTrans = ({type, start, from, startX, fromX, startY, fromY, items}) => {
              if (type === 'translate' || type === 'scale') {
                addStyle(`${type}X`, startX ?? fromX);
                addStyle(`${type}Y`, startY ?? fromY);
              }
              // can do pivot? transform origin?
              if (type === 'alpha' || type === 'rotate') addStyle(type, start ?? from);
              items?.forEach(convertTrans);
            };
            convertTrans(trans);
            return transStyle;
          })}
          // only return the exact ones needed
          mountedStyle={mountedStyle || {duration, translateX: 0, translateX_pc: 0, scaleX: 1, scaleX_pc: 100, alpha: 1}}
          crumbStyle={crumbedStyle || ((state, data, crumbs, nextState, nextData) => {
            let trans = returnOrCall(crumbStyle, true, state, data, crumbs, nextState, nextData);
            if (!trans || typeof trans === 'string')
              trans = {type: 'translate',  startX: 0};
            trans = !Array.isArray(trans) ? trans : {items: trans};
            const transStyle = {duration, translateX: 0, translateX_pc: 0, scaleX: 1, scaleX_pc: 100, alpha: 1};
            const addStyle = (type: string, start: string | number) => {
              if (start === undefined) return;
              const percent = typeof start === 'string' && start.endsWith('%')
              transStyle[type + (percent ? '_pc' : '')] = percent ? +(start as string).slice(0, -1) : +start;
            }
            const convertTrans = ({type, start, from, startX, fromX, startY, fromY, items}) => {
              if (type === 'translate' || type === 'scale') {
                addStyle(`${type}X`, startX ?? fromX);
                addStyle(`${type}Y`, startY ?? fromY);
              }
              // can do pivot? transform origin?
              if (type === 'alpha' || type === 'rotate') addStyle(type, start ?? from);
              items?.forEach(convertTrans);
            };
            convertTrans(trans);
            return transStyle;
          })}
          sharedElementMotion={sharedElementTransition}
          duration={duration}
          renderScene={renderScene}
          renderMotion={typeof children !== 'function' ? renderTransition || renderMotion : undefined}>
          {typeof children !== 'function' ? cloneScenes(children) : (children || renderMotion)}
      </NavigationMotion>
  );
}

const renderMotion = ({translateX, translateX_pc, scaleX, scaleX_pc}, scene, key) => (
  <View key={key}
    style={{
      transform: `
        translate(${translateX ? `${translateX}px` : translateX_pc ? `${translateX_pc}%` : '0'})
        scale(${scaleX !== 1 ? `${scaleX}` : scaleX_pc ? `${scaleX_pc / 100}` : '1'})
      ` as any,
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
      ? React.cloneElement(scene, { crumbStyle: scene.props.crumbedStyle })
      : React.cloneElement(scene, null, cloneScenes(scene.props.children, true))
  ))
);

NavigationStack.Scene = Scene;
NavigationStack.HistoryManager = MobileHistoryManager;
NavigationStack.SharedElementTransition = SharedElementMotion;

export default NavigationStack;
