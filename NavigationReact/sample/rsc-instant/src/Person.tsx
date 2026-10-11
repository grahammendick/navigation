'use client'
import { NavigationBackLink } from 'navigation-react';

const Person = ({children}: any) => {
  return (
    <>
      <NavigationBackLink distance={1}>Person Search</NavigationBackLink>
      {children}
    </>
  )
}

export default Person;
