'use client';
import { ReactNode } from 'react';
import { Pressable } from 'react-native';
import { useNavigationEvent } from 'navigation-react';

const Link = ({stateKey, navigationData, children}: {stateKey?: string, navigationData?: any, children: ReactNode}) => {
  const {data, stateNavigator} = useNavigationEvent();
  return (
    <Pressable onPress={() => {
      if (stateKey) stateNavigator.navigate(stateKey, navigationData);
      else stateNavigator.refresh({...data, ...navigationData});
    }}>
      {children}
    </Pressable>
  );
};

export default Link;
