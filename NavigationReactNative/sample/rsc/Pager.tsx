import { Text, View } from 'react-native';
import { useNavigationEvent } from 'navigation-react';
import RefreshLink from './RefreshLink';

const Pager = ({totalRowCount}: {totalRowCount: number}) => {
  const {data: {page, size}} = useNavigationEvent();
  const lastPage = Math.ceil(totalRowCount / size);
  return (
    <View style={{padding: 10}}>
      <View style={{flexDirection: 'row', gap: 20}}>
        <RefreshLink navigationData={{page: 1}}>
          <Text style={{fontSize: 20}}>First</Text>
        </RefreshLink>
        <RefreshLink navigationData={{page: Math.max(page - 1, 1)}}>
          <Text style={{fontSize: 20}}>Previous</Text>
        </RefreshLink>
        <RefreshLink navigationData={{page: Math.min(lastPage, page + 1)}}>
          <Text style={{fontSize: 20}}>Next</Text>
        </RefreshLink>
        <RefreshLink navigationData={{page: lastPage}}>
          <Text style={{fontSize: 20}}>Last</Text>
        </RefreshLink>
      </View>
      <Text style={{fontSize: 20, paddingTop: 10}}>Total Count {totalRowCount}</Text>
    </View>
  );
};

export default Pager;
