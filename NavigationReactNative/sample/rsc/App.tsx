import { Suspense, useState } from 'react';
import { StateNavigator } from 'navigation';
import { BundlerContext, NavigationHandler, SceneRSCView } from 'navigation-react';
import { NavigationStack, Scene } from 'navigation-react-native';
import stateNavigator from './stateNavigator';
import { renderSceneViews } from './render';

export default function App() {
  const [clientNavigator] = useState(() => {
    const clientNavigator = new StateNavigator(stateNavigator);
    clientNavigator.navigate('home');
    return clientNavigator;
  });
  return (
    <BundlerContext.Provider value={{fetchRSC: renderSceneViews} as any}>
      <NavigationHandler stateNavigator={clientNavigator}>
        <NavigationStack>
          <Scene stateKey="home">
            <Suspense fallback={null}>
              <SceneRSCView active="home" />
            </Suspense>
          </Scene>
        </NavigationStack>
      </NavigationHandler>
    </BundlerContext.Provider>
  );
}
