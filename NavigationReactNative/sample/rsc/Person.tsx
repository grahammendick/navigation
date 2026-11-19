import { Text, View } from 'react-native';
import { SceneView, useNavigationEvent } from 'navigation-react';
import { getPerson } from './data';
import Gender from './Gender';
import Friends from './Friends';

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
      <Gender>
        <SceneView active="person" name="friends" fallback={<View />}>
          <Friends />
        </SceneView>
      </Gender>
    </View>
  );
};

export default Person;
