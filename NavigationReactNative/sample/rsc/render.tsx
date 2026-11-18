'use server';
import { StateNavigator } from 'navigation';
import { NavigationHandler, SceneView } from 'navigation-react';
import stateNavigator from './stateNavigator';
import Home from './Home';

export async function renderSceneViews({url, sceneViewKeys}: {url: string, sceneViewKeys: string[]}) {
  const sceneViews: any = {
    home: Home,
  };
  const serverNavigator = new StateNavigator(stateNavigator);
  serverNavigator.navigateLink(url);
  const {state} = serverNavigator.stateContext;
  return {
    sceneViews: sceneViewKeys.reduce((SceneViews: any, key: string) => {
      const Content = sceneViews[key];
      SceneViews[key] = (
        <NavigationHandler stateNavigator={serverNavigator}>
          <SceneView fetching active={[state.key]} name={key}><Content /></SceneView>
        </NavigationHandler>
      );
      return SceneViews;
    }, {})
  };
}
