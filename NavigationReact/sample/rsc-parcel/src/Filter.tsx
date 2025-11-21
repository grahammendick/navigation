'use client'
import { RefreshLink, useNavigationEvent } from 'navigation-react';
import { useEffect } from 'react';

const Filter = () => {
  const { state, data, stateNavigator } = useNavigationEvent();
  const { name } = data;
  useEffect(() => {
    // if (state.key === 'person') throw Error('aargh')
    console.log(state.key);
  }, [state]);
  return (
    <div>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" value={name || ''} onChange={({ target: { value } }) => {
          stateNavigator.refresh({ ...data, name: value, page: null });
        }} />
      </div>
      Page size
      <RefreshLink navigationData={{ size: 5, page: null }} includeCurrentData>5</RefreshLink>
      <RefreshLink navigationData={{ size: 10, page: null }} includeCurrentData>10</RefreshLink>
    </div>
  );
}

export default Filter;
