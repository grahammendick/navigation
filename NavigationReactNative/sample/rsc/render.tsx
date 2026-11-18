'use server';
import { StateNavigator } from 'navigation';
import { NavigationHandler, SceneView } from 'navigation-react';
import stateNavigator from './stateNavigator';
import Home from './Home';

export async function renderStack() {
  const serverNavigator = new StateNavigator(stateNavigator);
  serverNavigator.navigate('home');
  return (
    <NavigationHandler stateNavigator={serverNavigator}>
      <SceneView active="home">
        <Home />
      </SceneView>
    </NavigationHandler>
  );
}
