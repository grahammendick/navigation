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

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,POST');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'rsc-action');
  next();
});

app.use(express.static('dist'));
app.use(express.json());

const sceneViews: any = {
  people: People,
  person: Person,
  friends: Friends
};

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
  ));
});

app.post('*', async (req, res) => {
  const View = sceneViews[req.body.sceneView];
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

let server = app.listen(3001);
console.log('Server listening on port 3001');
