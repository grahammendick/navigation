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
    friends: Friends
  };
  const {url, sceneViewKey, sceneViews: rootSceneViews} = req.body;
  // const View = sceneViews[sceneViewKey];
  const serverNavigator = new StateNavigator(stateNavigator);
  serverNavigator.navigateLink(url);
  serverNavigator.refresh({id: 2});
  const {state} = serverNavigator.stateContext;
  const View = Object.keys(rootSceneViews).reduce((root, key) => {
      const active = rootSceneViews[key]
      const show =  active != null && (
          typeof active === 'string' ? state.key === active : active.indexOf(state.key) !== -1
      );
      return show ? sceneViews[key] : root;
  }, null) as any;
  const stream = renderRSC({
    url: serverNavigator.stateContext.url,
    view: (
      <NavigationHandler stateNavigator={serverNavigator}>
        <View />
      </NavigationHandler>
    )
  });
  res.set('Content-Type', 'text/x-component');
  stream.pipe(res);
});

app.put('*', async (req, res) => {
  const serverNavigator = new StateNavigator(stateNavigator);
  const {state, data, crumbs} = req.body;
  let fluentNavigator = serverNavigator.fluent();
  for (let i = 0; i < crumbs.length; i++) {
    fluentNavigator = fluentNavigator.navigate(crumbs[i].state, crumbs[i].data);
  }
  fluentNavigator = fluentNavigator.navigate(state, data);
  serverNavigator.navigateLink(fluentNavigator.url);
  const stream = renderRSC(
    <NavigationHandler stateNavigator={serverNavigator}>
      <App url={fluentNavigator.url} />
    </NavigationHandler>
  );
  res.set('Content-Type', 'text/x-component');
  stream.pipe(res);
});

app.listen(3001, () => {
  console.log('Server listening on port 3001...');
});
