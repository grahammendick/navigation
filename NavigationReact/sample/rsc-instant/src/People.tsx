'use client'
import { RefreshLink, useNavigationEvent } from 'navigation-react';

const People = ({children}: any) => {
  const { data, stateNavigator } = useNavigationEvent();
  const { name } = data;
  return (
    <>
      <title>People</title>
      <h1>People</h1>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" autoComplete="off" value={name || ''} autoFocus onChange={({ target: { value } }) => {
          stateNavigator.refresh({ ...data, name: value, page: null });
        }} />
      </div>
      Page size
      <RefreshLink navigationData={{ size: 5, page: null }} includeCurrentData>5</RefreshLink>
      <RefreshLink navigationData={{ size: 10, page: null }} includeCurrentData>10</RefreshLink>
      {children}
    </>
  );
}

export default People;
