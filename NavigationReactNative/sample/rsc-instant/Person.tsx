'use client';
import { Children, ReactNode, useState } from 'react';
import { ScrollView } from 'react-native';
import { NavigationBar } from 'navigation-react-native';
import TitleContext from './TitleContext';

const Person = ({children}: {children: ReactNode}) => {
  const [title, setTitle] = useState('Person');
  const [header, details] = Children.toArray(children);
  return (
    <TitleContext.Provider value={setTitle}>
      <NavigationBar title={title} />
      {header}
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.person}>
        {details}
      </ScrollView>
    </TitleContext.Provider>
  );
};

export default Person;

const styles = {
  person: {
    padding: 10,
  },
} as const;
