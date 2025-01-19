'use server-entry'

import { Suspense } from 'react';
import { getFriends } from './data';
import { RefreshLink, useNavigationEvent } from 'navigation-react';

const Friends = async () => {
  const {data: {show}} = useNavigationEvent();
  if (!show)
    return <RefreshLink navigationData={{show: true}} includeCurrentData>Show Friends</RefreshLink>
  return (
    <Suspense fallback={<><RefreshLink navigationData={{show: true}} includeCurrentData>Show Friends</RefreshLink><h2>Loading...</h2></>}>
      <List />
    </Suspense>
  );
}

const List = async () => {
  const {data: {id}} = useNavigationEvent();
  const friends = await getFriends(id);
  return (
    <>
      <RefreshLink navigationData={{show: false}} includeCurrentData>Hide Friends</RefreshLink>
      <ul>
        {friends.map(({id, name}) => (
          <li><RefreshLink navigationData={{id}} includeCurrentData>{name}</RefreshLink></li>
        ))}
      </ul>
    </>
  );
}

export default Friends;
