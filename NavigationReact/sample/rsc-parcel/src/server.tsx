import express from 'express';
import { renderRequest, renderRSC } from '@parcel/rsc/node';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import stateNavigator from './stateNavigator';
import App from './App';
import Person from './Person';
import People from './People';
import List from './List';
import Friends from './Friends';
import Banner from './Banner';

const app = express();

app.use(express.static('dist'));
app.use(express.json());

app.get(['/favicon.ico', '/.well-known/*.json'], function (req, res) {
  res.statusCode = 404;
  res.end();
});

app.get('*', async (req, res) => {
  const serverNavigator = new StateNavigator(stateNavigator);
  serverNavigator.navigateLink(req.url);
  await renderRequest(req, res, (
    <NavigationHandler stateNavigator={serverNavigator}>
      <App url={req.url} />
    </NavigationHandler>
  ), {component: App});
});

app.post('*', async (req, res) => {
  const sceneViews: any = {
    people: People,
    list: List,
    person: Person,
    friends: Friends,
    banner: Banner
  };
  const {url, sceneViewKey, sceneViews: rootSceneViews} = req.body;
  const serverNavigator = new StateNavigator(stateNavigator);
  serverNavigator.navigateLink(url);
  const id = serverNavigator.stateContext.data.id || 1;
  // serverNavigator.refresh({...serverNavigator.stateContext.data, id: id + 1});
  serverNavigator.navigate('people');
  const {state, oldState} = serverNavigator.stateContext;
  const activeSceneViews = oldState ? Object.keys(rootSceneViews).reduce((activeRoots, rootKey) => {
      const active = rootSceneViews[rootKey];
      const show =  active != null && (
          typeof active === 'string' ? state.key === active : active.indexOf(state.key) !== -1
      );
      if (show) activeRoots.push(rootKey);
      return activeRoots;
    }, [] as string[]) : [sceneViewKey];
  const stream = renderRSC({
    url: oldState ? serverNavigator.stateContext.url : undefined,
    sceneViews: activeSceneViews.reduce((SceneViews, activeSceneViewKey) => {
      const SceneView = sceneViews[activeSceneViewKey];
      SceneViews[activeSceneViewKey] = (
        <NavigationHandler stateNavigator={serverNavigator}>
          <SceneView />
        </NavigationHandler>
      );
      return SceneViews;
    }, {})
  });
  res.set('Content-Type', 'text/x-component');
  stream.pipe(res);
});

app.listen(3001, () => {
  console.log('Server listening on port 3001...');
});
