'use server';
import { Text, View } from 'react-native';
import { SceneView, useNavigationEvent } from 'navigation-react';
import { getPerson } from './data';
import Gender from './Gender';
import Friends from './Friends';
import Edit from './Edit';

const Details = async () => {
  const {data: {id}} = useNavigationEvent();
  const {name, dateOfBirth, email, phone} = await getPerson(id);
  return (
    <View>
      <Edit key={id} id={id} name={name} />
      <Text>Date of Birth</Text>
      <Text>{dateOfBirth}</Text>
      <Text>Email</Text>
      <Text>{email}</Text>
      <Text>Phone</Text>
      <Text>{phone}</Text>
      <Gender>
        <SceneView active="person" name="friends" fallback={null}>
          <Friends />
        </SceneView>
      </Gender>
    </View>
  );
};

export default Details;
