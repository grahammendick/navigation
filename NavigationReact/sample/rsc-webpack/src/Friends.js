'use server-entry'
import * as React from 'react';
import { RefreshLink, useNavigationEvent } from 'navigation-react';
import { getFriends } from './data.js';
import Gender from './Gender.js';

const Friends = async () => {
  const {data: {show, id, gender}} = useNavigationEvent();
  const friends = show ? await getFriends(id, gender) : null;
  return (
    <>
      <RefreshLink navigationData={{show: !show}} includeCurrentData>{`${!show ? 'Show' : 'Hide'} Friends`}</RefreshLink>
      {show && (
        <>
          <Gender />
          <ul>
            {friends?.map(({id, name}) => (
              <li key={id}><RefreshLink navigationData={{id}} includeCurrentData>{name}</RefreshLink></li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export default Friends;
