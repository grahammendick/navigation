'use client'
import { NavigationBackLink, RefreshLink } from 'navigation-react';

const Person = ({children}: any) => {
  return (
    <>
      <h1>Person</h1>
      <NavigationBackLink distance={1}>Person Search</NavigationBackLink>
      <RefreshLink navigationData={{gender: 'male'}} includeCurrentData>Male</RefreshLink>
      {children}
    </>
  )
}

export default Person;
