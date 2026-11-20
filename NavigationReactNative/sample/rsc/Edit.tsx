'use client';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSceneView } from 'navigation-react';
import updateName from './updateName';

const Edit = ({id, name}: {id: number, name: string}) => {
  const saveName = useSceneView(updateName);
  const [value, setValue] = useState(name);
  return (
    <View style={styles.edit}>
      <TextInput
        value={value}
        autoCorrect={false}
        onChangeText={setValue}
        style={styles.name} />
      <Pressable onPress={() => saveName(id, value)}>
        <Text style={styles.text}>Save</Text>
      </Pressable>
      <Pressable onPress={() => setValue(name)}>
        <Text style={styles.text}>Reset</Text>
      </Pressable>
    </View>
  );
};

export default Edit;

const styles = StyleSheet.create({
  edit: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    paddingVertical: 10,
  },
  name: {
    flex: 1,
    fontSize: 20,
    borderWidth: 1,
    padding: 8,
  },
  text: {
    fontSize: 20,
  },
});
