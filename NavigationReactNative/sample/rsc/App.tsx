import { Suspense, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StateNavigator } from 'navigation';
import { BundlerContext, NavigationHandler, SceneRSCView } from 'navigation-react';
import stateNavigator from './stateNavigator';
import { renderSceneViews } from './render';

export default function App() {
  const [clientNavigator] = useState(() => {
    const clientNavigator = new StateNavigator(stateNavigator);
    clientNavigator.navigate('home');
    return clientNavigator;
  });
  return (
    <View style={styles.container}>
      <BundlerContext.Provider value={{fetchRSC: renderSceneViews} as any}>
        <NavigationHandler stateNavigator={clientNavigator}>
          <Suspense fallback={<Text>loading...</Text>}>
            <SceneRSCView active="home" />
          </Suspense>
        </NavigationHandler>
      </BundlerContext.Provider>
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
