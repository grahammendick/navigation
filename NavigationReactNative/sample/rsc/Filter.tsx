'use client';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigationEvent } from 'navigation-react';
import Link from './Link';

const Filter = () => {
  const {data, stateNavigator} = useNavigationEvent();
  const {name} = data;
  return (
    <View style={styles.filter}>
      <TextInput
        value={name || ''}
        placeholder="Name"
        autoCorrect={false}
        onChangeText={value => stateNavigator.refresh({...data, name: value, page: null})}
        style={styles.name} />
      <View style={styles.sizes}>
        <Text style={styles.text}>Page size</Text>
        <Link navigationData={{size: 5, page: null}}>
          <Text style={styles.text}>5</Text>
        </Link>
        <Link navigationData={{size: 10, page: null}}>
          <Text style={styles.text}>10</Text>
        </Link>
      </View>
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({
  filter: {
    padding: 10,
  },
  name: {
    fontSize: 20,
    borderWidth: 1,
    padding: 8,
  },
  sizes: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 10,
  },
  text: {
    fontSize: 20,
  },
});
