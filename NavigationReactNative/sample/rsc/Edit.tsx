'use client';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useSceneView } from 'navigation-react';
import updateName from './updateName';

const Edit = ({id, name}: {id: number, name: string}) => {
  const saveName = useSceneView(updateName);
  const [value, setValue] = useState(name);
  return (
    <View style={{flexDirection: 'row', gap: 20, alignItems: 'center', paddingVertical: 10}}>
      <TextInput
        value={value}
        autoCorrect={false}
        onChangeText={setValue}
        style={{flex: 1, fontSize: 20, borderWidth: 1, padding: 8}} />
      <Pressable onPress={() => saveName(id, value)}>
        <Text style={{fontSize: 20}}>Save</Text>
      </Pressable>
      <Pressable onPress={() => setValue(name)}>
        <Text style={{fontSize: 20}}>Reset</Text>
      </Pressable>
    </View>
  );
};

export default Edit;
