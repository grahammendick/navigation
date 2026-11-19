'use server';
import { StateNavigator } from 'navigation';
import { NavigationHandler, SceneView } from 'navigation-react';
import stateNavigator from './stateNavigator';
import People from './People';
import List from './List';
import Person from './Person';
import Friends from './Friends';

export async function renderSceneViews({url, sceneViewKeys, rootViews, actionId, args}: {url: string, sceneViewKeys: string[], rootViews: any, actionId: any, args: any[]}) {
  const sceneViews: any = {
    people: People,
    list: List,
    person: Person,
    friends: Friends,
  };
  const serverNavigator = new StateNavigator(stateNavigator);
  serverNavigator.navigateLink(url);
  let data = null; let invalidate = [] as (string | false | null)[] | true;
  if (actionId) {
    const scene = {
      stateNavigator: serverNavigator,
      invalidate: (scope?: boolean | string) => {
        if (invalidate === true) return;
        if (scope === true) invalidate = true;
        else invalidate.push(scope === undefined ? null : scope);
      }
    };
    data = await actionId(...args, scene);
  }
  const {state} = serverNavigator.stateContext;
  const sceneInvalidated = invalidate === true || invalidate.indexOf(null) !== -1 || invalidate.indexOf(state.key) !== -1;
  const viewInvalidated = invalidate !== true && invalidate.indexOf(false) !== -1;
  const activeViews = sceneInvalidated ? Object.keys(rootViews).filter(rootKey => {
    const active = rootViews[rootKey];
    return active != null && (typeof active === 'string' ? state.key === active : active.indexOf(state.key) !== -1);
  }) : ((!actionId || viewInvalidated) ? sceneViewKeys : []);
  return {
    data,
    invalidate,
    sceneViews: activeViews.reduce((SceneViews: any, key: string) => {
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
