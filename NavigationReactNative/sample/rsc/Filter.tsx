'use client';
import { Text, TextInput, View } from 'react-native';
import { useNavigationEvent } from 'navigation-react';
import RefreshLink from './RefreshLink';

const Filter = () => {
  const {data, stateNavigator} = useNavigationEvent();
  const {name} = data;
  return (
    <View style={{padding: 10}}>
      <TextInput
        value={name || ''}
        placeholder="Name"
        autoCorrect={false}
        onChangeText={value => stateNavigator.refresh({...data, name: value, page: null})}
        style={{fontSize: 20, borderWidth: 1, padding: 8}} />
      <View style={{flexDirection: 'row', gap: 20, paddingTop: 10}}>
        <Text style={{fontSize: 20}}>Page size</Text>
        <RefreshLink navigationData={{size: 5, page: null}}>
          <Text style={{fontSize: 20}}>5</Text>
        </RefreshLink>
        <RefreshLink navigationData={{size: 10, page: null}}>
          <Text style={{fontSize: 20}}>10</Text>
        </RefreshLink>
      </View>
    </View>
  );
};

export default Filter;
