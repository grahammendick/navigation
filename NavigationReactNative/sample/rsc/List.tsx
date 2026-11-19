import { Text, View } from 'react-native';
import { useNavigationEvent } from 'navigation-react';
import { searchPeople } from './data';
import Link from './Link';
import RefreshLink from './RefreshLink';
import Pager from './Pager';

const List = async () => {
  const {data: {name, page, size, sort}} = useNavigationEvent();
  const {people, count} = await searchPeople(name, page, size, sort);
  return (
    <View>
      <RefreshLink navigationData={{sort: sort === 'asc' ? 'desc' : 'asc'}}>
        <Text style={{fontSize: 20, padding: 10, fontWeight: 'bold'}}>Name {sort === 'asc' ? '▲' : '▼'}</Text>
      </RefreshLink>
      {people.map(({id, name}) => (
        <Link key={id} stateKey="person" navigationData={{id}}>
          <Text style={{fontSize: 20, padding: 10}}>{name}</Text>
        </Link>
      ))}
      <Pager totalRowCount={count} />
    </View>
  );
};

export default List;
