import { useNavigationEvent } from 'navigation-react';
import { getFriends } from './data';
import FriendList from './FriendList';

const Friends = () => {
  const {data} = useNavigationEvent();
  const friends = data.show && (async () => {
    const friends = await getFriends(data.id);
    return friends.filter(friend => !data.gender || friend.gender === data.gender);
  })();
  return data.show && <FriendList friends={friends} />;
}

export default Friends;
