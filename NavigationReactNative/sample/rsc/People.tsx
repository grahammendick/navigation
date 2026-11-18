import { Text, View } from 'react-native';
import { useNavigationEvent } from 'navigation-react';
import { searchPeople } from './data';
import Link from './Link';

const People = async () => {
  const {data: {name, page, size, sort}} = useNavigationEvent();
  const {people} = await searchPeople(name, page, size, sort);
  return (
    <View>
      {people.map(({id, name}) => (
        <Link key={id} stateKey="person" navigationData={{id}}>
          <Text style={{fontSize: 20, padding: 10}}>{name}</Text>
        </Link>
      ))}
    </View>
  );
};

export default People;
