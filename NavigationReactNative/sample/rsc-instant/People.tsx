'use client';
import { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { NavigationBar } from 'navigation-react-native';
import Filter from './Filter';

const People = ({children}: {children: ReactNode}) => (
  <>
    <NavigationBar title="People" />
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Filter />
      {children}
    </ScrollView>
  </>
);

export default People;
