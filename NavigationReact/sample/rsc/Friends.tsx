'use server-entry'

import { Suspense } from 'react';
import { RefreshLink, useNavigationEvent } from 'navigation-react';
import { getFriends } from './data';
import Gender from './Gender';

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
  const {data: {id, gender}} = useNavigationEvent();
  const friends = await getFriends(id, gender);
  return (
    <>
      <Gender />
      <ul>
        {friends.map(({id, name}) => (
          <li key={id}><RefreshLink navigationData={{id}} includeCurrentData>{name}</RefreshLink></li>
        ))}
      </ul>
    </>
  );
}

export default Friends;
