import { Text, View } from 'react-native';
import { useNavigationEvent } from 'navigation-react';
import Link from './Link';

const Pager = ({totalRowCount}: {totalRowCount: number}) => {
  const {data: {page, size}} = useNavigationEvent();
  const lastPage = Math.ceil(totalRowCount / size);
  return (
    <View style={styles.pager}>
      <View style={styles.pages}>
        <Link navigationData={{page: 1}}>
          <Text style={styles.text}>First</Text>
        </Link>
        <Link navigationData={{page: Math.max(page - 1, 1)}}>
          <Text style={styles.text}>Previous</Text>
        </Link>
        <Link navigationData={{page: Math.min(lastPage, page + 1)}}>
          <Text style={styles.text}>Next</Text>
        </Link>
        <Link navigationData={{page: lastPage}}>
          <Text style={styles.text}>Last</Text>
        </Link>
      </View>
      <Text style={[styles.text, styles.count]}>Total Count {totalRowCount}</Text>
    </View>
  );
};

export default Pager;

const styles = {
  pager: {
    padding: 10,
  },
  pages: {
    flexDirection: 'row',
    gap: 20,
  },
  text: {
    fontSize: 20,
  },
  count: {
    paddingTop: 10,
  },
} as const;
