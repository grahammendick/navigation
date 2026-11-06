'use client'
import { RefreshLink, useNavigationEvent, useRefetch } from 'navigation-react';

const Filter = () => {
  const { data, stateNavigator } = useNavigationEvent();
  const { name } = data;
  const refetch = useRefetch();
  return (
    <div>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" autoComplete="off" value={name || ''} autoFocus onChange={({ target: { value } }) => {
          stateNavigator.refresh({ ...data, name: value, page: null });
        }} />
      </div>
      Page size
      <RefreshLink navigationData={{ size: 5, page: null }} includeCurrentData>5</RefreshLink>
      <RefreshLink navigationData={{ size: 10, page: null }} includeCurrentData>10</RefreshLink>
      <button onClick={() => refetch()}>Refetch</button>
    </div>
  );
}

export default Filter;
