import { Suspense, use } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { renderStack } from './actions/render';

const stack = renderStack();

const Root = () => use(stack);

export default function App() {
  return (
    <View style={styles.container}>
      <Suspense fallback={<Text>loading...</Text>}>
        <Root />
      </Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
