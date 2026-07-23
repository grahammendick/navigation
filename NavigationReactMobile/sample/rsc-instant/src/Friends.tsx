import { RefreshLink, useNavigationEvent } from 'navigation-react';
import { getFriends } from './data';

const Friends = async () => {
  const {data: {show, id, gender}} = useNavigationEvent();
  const friends = show ? await getFriends(id, gender) : null;
  return show && (
    <ul>
      {friends?.map(({id, name}) => (
        <li key={id}><RefreshLink navigationData={{id}} includeCurrentData>{name}</RefreshLink></li>
      ))}
    </ul>
  );
}

export default Friends;
