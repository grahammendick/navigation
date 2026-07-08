'use client'
import Filter from './Filter';
import { Suspense } from 'react';

const People = ({children}: any) => {
  return (
    <>
      <title>People</title>
      <h1>People</h1>
      <Filter />
      <Suspense fallback={<h2>loading...</h2>}>
        {children}
      </Suspense>
    </>
  );
}

export default People;
