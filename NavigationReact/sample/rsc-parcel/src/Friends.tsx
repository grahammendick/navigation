import { RefreshLink, useNavigationEvent } from 'navigation-react';
import { getFriends } from './data';

const Friends = async () => {
  const {data} = useNavigationEvent();
  const friends = data.show ? await getFriends(data.id) : null;
  const filtered = friends?.filter(friend => !data.gender || friend.gender === data.gender);
  return data.show && (
    <ul>
      {filtered?.map(({id, name}) => (
        <li key={id}><RefreshLink navigationData={{id}} includeCurrentData>{name}</RefreshLink></li>
      ))}
    </ul>
  );
}

export default Friends;
