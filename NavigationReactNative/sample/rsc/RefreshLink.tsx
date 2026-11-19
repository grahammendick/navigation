'use client';
import { ReactNode } from 'react';
import { Pressable } from 'react-native';
import { useNavigationEvent } from 'navigation-react';

const RefreshLink = ({navigationData, children}: {navigationData: any, children: ReactNode}) => {
  const {data, stateNavigator} = useNavigationEvent();
  return (
    <Pressable onPress={() => stateNavigator.refresh({...data, ...navigationData})}>
      {children}
    </Pressable>
  );
};

export default RefreshLink;
