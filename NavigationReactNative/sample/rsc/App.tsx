import { Suspense, useState } from 'react';
import { StateNavigator } from 'navigation';
import { BundlerContext, NavigationHandler, SceneRSCView } from 'navigation-react';
import { NavigationStack, Scene } from 'navigation-react-native';
import stateNavigator from './stateNavigator';
import { renderSceneViews } from './server';

export default function App() {
  const [clientNavigator] = useState(() => {
    const clientNavigator = new StateNavigator(stateNavigator);
    clientNavigator.navigate('people');
    return clientNavigator;
  });
  return (
    <BundlerContext.Provider value={{fetchRSC: renderSceneViews} as any}>
      <NavigationHandler stateNavigator={clientNavigator}>
        <Suspense fallback={null}>
          <NavigationStack>
            <Scene stateKey="people">
              <SceneRSCView active="people" cache {...{__scene: true}} />
            </Scene>
            <Scene stateKey="person">
              <SceneRSCView active="person" cache {...{__scene: true}} />
            </Scene>
          </NavigationStack>
        </Suspense>
      </NavigationHandler>
    </BundlerContext.Provider>
  );
}
