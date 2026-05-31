import { NavigationLink, RefreshLink, useNavigationEvent } from 'navigation-react';
import { getFriends } from './data';

const Friends = async () => {
  const {data: {show, id, gender}} = useNavigationEvent();
  const friends = show ? await getFriends(id, gender) : null;
  return show && (
    <ul>
      {friends?.map(({id, name}) => (
        <li key={id}><NavigationLink stateKey="person" navigationData={{id}} includeCurrentData>{name}</NavigationLink></li>
      ))}
    </ul>
  );
}

export default Friends;
