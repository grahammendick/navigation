import { Suspense, use, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import stateNavigator from './stateNavigator';
import { renderStack } from './render';

const stack = renderStack();

const Root = () => use(stack);

export default function App() {
  const [clientNavigator] = useState(() => {
    const clientNavigator = new StateNavigator(stateNavigator);
    clientNavigator.navigate('home');
    return clientNavigator;
  });
  return (
    <View style={styles.container}>
      <NavigationHandler stateNavigator={clientNavigator}>
        <Suspense fallback={<Text>loading...</Text>}>
          <Root />
        </Suspense>
      </NavigationHandler>
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
