// Server dependencies.
import express, {type Request as ExpressRequest, type Response as ExpressResponse} from 'express';
import {Readable} from 'node:stream';
import type { ReadableStream as NodeReadableStream } from 'stream/web';
import {renderToReadableStream} from 'react-server-dom-parcel/server.edge';
import {injectRSCPayload} from 'rsc-html-stream/server';

// Client dependencies, used for SSR.
// These must run in the same environment as client components (e.g. same instance of React).
import {createFromReadableStream} from 'react-server-dom-parcel/client' with {env: 'react-client'};
import {renderToReadableStream as renderHTMLToReadableStream} from 'react-dom/server' with {env: 'react-client'};
import ReactClient, {ReactElement} from 'react' with {env: 'react-client'};

import { StateNavigator } from 'navigation';
import { NavigationContext } from 'navigation-react';
import stateNavigator from './stateNavigator';

// Page components. These must have "use server-entry" so they are treated as code splitting entry points.
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

app.get('/favicon.ico', function(req, res) {
  res.statusCode = 404;
  res.end();
});

app.get('*', async (req, res) => {
  const navigator = new StateNavigator(stateNavigator);
  navigator.navigateLink(req.url);
  const {oldState, state, data, asyncData} = navigator.stateContext;
  const navigationEvent = {oldState, state, data, asyncData, stateNavigator: navigator};
  await render(req, res, (
    <NavigationContext.Provider value={navigationEvent}>
      <App url={req.url} />
    </NavigationContext.Provider>
  ));
});

app.post('*', async (req, res) => {
  const View = sceneViews[req.body.sceneView];
  const navigator = new StateNavigator(stateNavigator);
  navigator.navigateLink(req.body.oldUrl);
  navigator.navigateLink(req.url);
  const {oldState, state, data, asyncData} = navigator.stateContext;
  const navigationEvent = {oldState, state, data, asyncData, stateNavigator: navigator};
  await render(req, res, (
    <NavigationContext.Provider value={navigationEvent}>
      <View />
    </NavigationContext.Provider>
  ));
});

async function render(req: ExpressRequest, res: ExpressResponse, component: ReactElement, actionResult?: any) {
  // Render RSC payload.
  let root: any = component;
  if (actionResult) {
    root = {result: actionResult, root};
  }
  let stream = renderToReadableStream(root);
  if (req.accepts('text/html')) {
    res.setHeader('Content-Type', 'text/html');

    // Use client react to render the RSC payload to HTML.
    let [s1, s2] = stream.tee();
    let data = createFromReadableStream<ReactElement>(s1);
    function Content() {
      return ReactClient.use(data);
    }

    let htmlStream = await renderHTMLToReadableStream(<Content />);
    let response = htmlStream.pipeThrough(injectRSCPayload(s2));
    Readable.fromWeb(response as NodeReadableStream).pipe(res);
  } else {
    res.set('Content-Type', 'text/x-component');
    Readable.fromWeb(stream as NodeReadableStream).pipe(res);
  }
}

let server = app.listen(3001);
console.log('Server listening on port 3001');

// Restart the server when it changes.
if (module.hot) {
  module.hot.dispose(() => {
    server.close();
  });

  module.hot.accept();
}
