'use client'
import { useEffect } from 'react';
import { RefreshLink, useNavigationEvent, usePrefetch } from 'navigation-react';

const Filter = () => {
  const { data, stateNavigator } = useNavigationEvent();
  const { name } = data;
  const prefetch = usePrefetch();
  useEffect(() => {
    prefetch.navigate('person', { id: 2 });
    prefetch.navigate('person', { id: 2 });
  }, []);
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
      <button type="button" onClick={() => prefetch.navigate('person', { id: 3 })}>Prefetch 3</button>
    </div>
  );
}

export default Filter;
