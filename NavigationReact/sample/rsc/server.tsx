import express from 'express';
import { renderRequest, renderRSC } from '@parcel/rsc/node';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import stateNavigator from './stateNavigator';
import App from './App';
import Person from './Person';
import People from './People';
import Friends from './Friends';

const app = express();

app.use(express.static('dist'));
app.use(express.json());

app.get('/favicon.ico', function (req, res) {
  res.statusCode = 404;
  res.end();
});

app.get('*', async (req, res) => {
  const navigator = new StateNavigator(stateNavigator);
  navigator.navigateLink(req.url);
  await renderRequest(req, res, (
    <NavigationHandler stateNavigator={navigator}>
      <App url={req.url} />
    </NavigationHandler>
  ), {component: App});
});

app.post('*', async (req, res) => {
  const sceneViews: any = {
    people: People,
    person: Person,
    friends: Friends
  };
  const View = sceneViews[req.body.sceneViewKey];
  const navigator = new StateNavigator(stateNavigator);
  navigator.navigateLink(req.body.oldUrl);
  navigator.navigateLink(req.url);
  const stream = renderRSC(
    <NavigationHandler stateNavigator={navigator}>
      <View />
    </NavigationHandler>
  );
  res.set('Content-Type', 'text/x-component');
  stream.pipe(res);
});

app.listen(3001);
console.log('Server listening on port 3001');
