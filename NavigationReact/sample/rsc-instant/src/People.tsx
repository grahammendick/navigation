'use client'
import Filter from './Filter';

const People = ({children}: any) => {
  return (
    <>
      <title>People</title>
      <h1>People</h1>
      <Filter />
      {children}
    </>
  );
}

export default People;
