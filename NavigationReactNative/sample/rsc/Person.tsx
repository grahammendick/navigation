import { Text, View } from 'react-native';
import { useNavigationEvent } from 'navigation-react';
import { getPerson } from './data';

const Person = async () => {
  const {data: {id}} = useNavigationEvent();
  const {name, dateOfBirth, email, phone} = await getPerson(id);
  return (
    <View style={{padding: 10}}>
      <Text style={{fontSize: 24}}>{name}</Text>
      <Text>Date of Birth</Text>
      <Text>{dateOfBirth}</Text>
      <Text>Email</Text>
      <Text>{email}</Text>
      <Text>Phone</Text>
      <Text>{phone}</Text>
    </View>
  );
};

export default Person;
