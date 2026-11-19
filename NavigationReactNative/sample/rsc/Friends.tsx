import { Text, View } from 'react-native';
import { useNavigationEvent } from 'navigation-react';
import { getFriends } from './data';
import Link from './Link';

const Friends = async () => {
  const {data: {show, id, gender}} = useNavigationEvent();
  const friends = show ? await getFriends(id, gender) : null;
  return show && (
    <View style={{paddingTop: 10}}>
      {friends?.map(({id, name}) => (
        <Link key={id} navigationData={{id}}>
          <Text style={{fontSize: 20, paddingVertical: 8}}>{name}</Text>
        </Link>
      ))}
    </View>
  );
};

export default Friends;
