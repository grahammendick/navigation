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
        <Suspense fallback={null}>
          <NavigationStack>
            <Scene stateKey="home">
              <SceneRSCView active="home" />
            </Scene>
          </NavigationStack>
        </Suspense>
      </NavigationHandler>
    </BundlerContext.Provider>
  );
}
