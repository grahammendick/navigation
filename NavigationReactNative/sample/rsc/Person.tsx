'use server';
import { Text, View } from 'react-native';
import { SceneView, useNavigationEvent } from 'navigation-react';
import { getPerson } from './data';
import Gender from './Gender';
import Friends from './Friends';
import Edit from './Edit';

const Person = async () => {
  const {data: {id}} = useNavigationEvent();
  const {name, dateOfBirth, email, phone} = await getPerson(id);
  return (
    <View style={styles.person}>
      <Text style={styles.name}>{name}</Text>
      <Edit key={id} id={id} name={name} />
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

const styles = {
  person: {
    padding: 10,
  },
  name: {
    fontSize: 24,
  },
} as const;
