import express from 'express';
import { Readable } from 'stream';
import { renderRequest, renderRSC } from '@parcel/rsc/node';
import { createTemporaryReferenceSet, decodeReply, loadServerAction } from 'react-server-dom-parcel/server.edge';
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

app.get(['/favicon.ico', '/.well-known/*.json'], (_req, res) => {
  res.statusCode = 404;
  res.end();
});

app.get('*', async (req, res) => {
  const serverNavigator = new StateNavigator(stateNavigator);
  serverNavigator.navigateLink(req.url);
  await renderRequest(req, res, (
    <NavigationHandler stateNavigator={serverNavigator}>
      <App url={serverNavigator.stateContext.url} />
    </NavigationHandler>
  ), {component: App});
});

app.post('*', async (req, res) => {
  const sceneViews: any = {
    people: People,
    list: List,
    person: Person,
    friends: Friends,
  };
  const {url, sceneViewKey, historyAction, rootViews, actionId, args} = await decodeBody(req);
  const serverNavigator = new StateNavigator(stateNavigator);
  if (url) serverNavigator.navigateLink(url, historyAction);
  let data = null; let refetch = null;
  if (req.headers['content-type'] !== 'application/json') {
    const action = await loadServerAction(actionId);
    const scene = {
      stateNavigator: serverNavigator,
      refetch: (scene: boolean = false) => {
        refetch = scene || sceneViewKey;
      }
    };
    data = await action.apply(null, url ? [...args, scene] : args);
  }
  const {state, oldState} = serverNavigator.stateContext;
  const activeViews = (oldState || refetch === true) ? Object.keys(rootViews).reduce((activeRoots, rootKey) => {
      const active = rootViews[rootKey];
      const show =  active != null && (
          typeof active === 'string' ? state.key === active : active.indexOf(state.key) !== -1
      );
      if (show) activeRoots.push(rootKey);
      return activeRoots;
    }, [] as string[]) : ((!actionId || refetch === sceneViewKey) ? [sceneViewKey] : []);
  const stream = renderRSC({
    data,
    refetch,
    url: oldState ? serverNavigator.stateContext.url : null,
    historyAction: oldState ? serverNavigator.stateContext.historyAction : null,
    sceneViews: activeViews.reduce((SceneViews, activeKey) => {
      const SceneView = sceneViews[activeKey];
      SceneViews[activeKey] = (
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

const decodeBody = async (req: any) => {
  if (req.headers['content-type'] !== 'application/json') {
    const temporaryReferences = createTemporaryReferenceSet();
    let request = new Request(`https://${req.get('host')}`, {
      headers: req.headers as any,
      method: 'POST',
      body: Readable.toWeb(req) as ReadableStream,
      // @ts-ignore
      duplex: 'half' as any,
    });
    const body = !req.headers['content-type']?.startsWith('multipart/form-data') ? await request.text() : await request.formData();
    return decodeReply(body, {temporaryReferences});
  }
  return req.body;
}

app.listen(3001, () => {
  console.log('Server listening on port 3001...');
});
