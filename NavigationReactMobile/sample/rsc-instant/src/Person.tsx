'use client'
import { Children } from 'react';
import { NavigationBackLink } from 'navigation-react';

const Person = ({children}: any) => {
  const [header, details] = Children.toArray(children);
  return (
    <>
      {header}
      <NavigationBackLink distance={1}>Person Search</NavigationBackLink>
      {details}
    </>
  )
}

export default Person;
