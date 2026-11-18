'use client';
import { ReactNode } from 'react';
import { Pressable } from 'react-native';
import { useNavigationEvent } from 'navigation-react';

const Link = ({stateKey, navigationData, children}: {stateKey: string, navigationData?: any, children: ReactNode}) => {
  const {stateNavigator} = useNavigationEvent();
  return (
    <Pressable onPress={() => stateNavigator.navigate(stateKey, navigationData)}>
      {children}
    </Pressable>
  );
};

export default Link;
