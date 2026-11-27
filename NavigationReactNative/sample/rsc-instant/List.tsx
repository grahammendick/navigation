import { Text, View } from 'react-native';
import { useNavigationEvent } from 'navigation-react';
import { searchPeople } from './data';
import Link from './Link';
import Pager from './Pager';

const List = async () => {
  const {data: {name, page, size, sort}} = useNavigationEvent();
  const {people, count} = await searchPeople(name, page, size, sort);
  return (
    <View>
      <Link navigationData={{sort: sort === 'asc' ? 'desc' : 'asc'}}>
        <Text style={[styles.row, styles.header]}>Name {sort === 'asc' ? '▲' : '▼'}</Text>
      </Link>
      {people.map(({id, name}) => (
        <Link key={id} stateKey="person" navigationData={{id}}>
          <Text style={styles.row}>{name}</Text>
        </Link>
      ))}
      <Pager totalRowCount={count} />
    </View>
  );
};

export default List;

const styles = {
  row: {
    fontSize: 20,
    padding: 10,
  },
  header: {
    fontWeight: 'bold',
  },
} as const;
