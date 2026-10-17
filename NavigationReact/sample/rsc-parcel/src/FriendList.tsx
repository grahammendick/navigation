'use client'
import { use } from 'react';
import { RefreshLink } from 'navigation-react';

const FriendList = ({list: {friends}}: any) => (
  <ul>
    {use(friends).map(({id, name}: any) => (
      <li key={id}><RefreshLink navigationData={{id}} includeCurrentData>{name}</RefreshLink></li>
    ))}
  </ul>
);

export default FriendList;
