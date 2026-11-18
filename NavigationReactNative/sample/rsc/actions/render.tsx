'use server';
import { StateNavigator } from 'navigation';
import { NavigationHandler, SceneView } from 'navigation-react';
import NavigationProvider from '../NavigationProvider';
import stateNavigator from '../stateNavigator';
import Home from '../Home';

export async function renderStack() {
  const serverNavigator = new StateNavigator(stateNavigator);
  serverNavigator.navigate('home');
  return (
    <NavigationHandler stateNavigator={serverNavigator}>
      <NavigationProvider url={serverNavigator.stateContext.url}>
        <SceneView active="home">
          <Home />
        </SceneView>
      </NavigationProvider>
    </NavigationHandler>
  );
}
