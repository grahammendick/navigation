'use server-entry'

import { Suspense } from 'react';
import { getFriends } from './data';
import { RefreshLink, useNavigationEvent } from 'navigation-react';

const Friends = async () => {
  const {data: {show}} = useNavigationEvent();
  return (
    <>
      <RefreshLink navigationData={{show: !show}} includeCurrentData>{`${!show ? 'Show' : 'Hide'} Friends`}</RefreshLink>
      {show && (
        <Suspense fallback={<h2>Loading...</h2>}>
          <List />
        </Suspense>
      )}
    </>
  );
}

const List = async () => {
  const {data} = useNavigationEvent();
  const friends = await getFriends(data.id);
  return (
    <ul>
      {friends.map(({id, name}) => (
        <li><RefreshLink navigationData={{id}} includeCurrentData>{name}</RefreshLink></li>
      ))}
    </ul>
  );
}

export default Friends;
