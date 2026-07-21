'use client'
import { NavigationBackLink } from 'navigation-react';
import { Suspense } from 'react';

const Person = ({children}: any) => {
  return (
    <>
      <h1>Person</h1>
      <NavigationBackLink distance={1}>Person Search</NavigationBackLink>
      <Suspense fallback={<h2>loading...</h2>}>
        {children}
      </Suspense>
    </>
  )
}

export default Person;
