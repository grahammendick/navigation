'use client'
import { NavigationBackLink } from 'navigation-react';

const Person = ({children}: any) => {
  return (
    <>
      <h1>Person</h1>
      <NavigationBackLink distance={1}>Person Search</NavigationBackLink>
      {children}
    </>
  )
}

export default Person;
