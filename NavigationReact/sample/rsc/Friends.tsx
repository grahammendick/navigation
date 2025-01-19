'use server-entry'

import { getFriends } from './data';
import { RefreshLink, useNavigationEvent } from 'navigation-react';

const Friends = async () => {
  const {data: {id, show}} = useNavigationEvent();
  if (!show)
    return <RefreshLink navigationData={{show: true}} includeCurrentData>Show Friends</RefreshLink>
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
