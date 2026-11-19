import { Text, View } from 'react-native';
import { useNavigationEvent } from 'navigation-react';
import Link from './Link';

const Pager = ({totalRowCount}: {totalRowCount: number}) => {
  const {data: {page, size}} = useNavigationEvent();
  const lastPage = Math.ceil(totalRowCount / size);
  return (
    <View style={{padding: 10}}>
      <View style={{flexDirection: 'row', gap: 20}}>
        <Link navigationData={{page: 1}}>
          <Text style={{fontSize: 20}}>First</Text>
        </Link>
        <Link navigationData={{page: Math.max(page - 1, 1)}}>
          <Text style={{fontSize: 20}}>Previous</Text>
        </Link>
        <Link navigationData={{page: Math.min(lastPage, page + 1)}}>
          <Text style={{fontSize: 20}}>Next</Text>
        </Link>
        <Link navigationData={{page: lastPage}}>
          <Text style={{fontSize: 20}}>Last</Text>
        </Link>
      </View>
      <Text style={{fontSize: 20, paddingTop: 10}}>Total Count {totalRowCount}</Text>
    </View>
  );
};

export default Pager;
