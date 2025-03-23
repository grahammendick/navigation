'use strict';

// This is a server to host data-local resources like databases and RSC

const path = require('path');
const url = require('url');

const register = require('react-server-dom-webpack/node-register');
register();

const babelRegister = require('@babel/register');
babelRegister({
  babelrc: false,
  ignore: [
    /\/(build|node_modules)\//,
    function (file) {
      if ((path.dirname(file) + '/').startsWith(__dirname + '/')) {
        // Ignore everything in this folder
        // because it's a mix of CJS and ESM
        // and working with raw code is easier.
        return true;
      }
      return false;
    },
  ],
  presets: ['@babel/preset-react'],
  plugins: ['@babel/transform-modules-commonjs'],
  sourceMaps: process.env.NODE_ENV === 'development' ? 'inline' : false,
});

const express = require('express');
const app = express();
const compress = require('compression');


app.use(compress());
app.use(express.json());

const {readFile} = require('fs').promises;

const React = require('react');
const {StateNavigator} = require('navigation');
const stateNavigator = require('../src/stateNavigator.js');

async function renderApp(req, res, el, navigator) {
  const {renderToPipeableStream} = await import(
    'react-server-dom-webpack/server'
  );

  let moduleMap;
  if (process.env.NODE_ENV === 'development') {
    // Read the module map from the HMR server in development.
    moduleMap = await (
      await fetch('http://localhost:3000/react-client-manifest.json')
    ).json();
  } else {
    // Read the module map from the static build in production.
    moduleMap = JSON.parse(
      await readFile(
        path.resolve(__dirname, `../build/react-client-manifest.json`),
        'utf8'
      )
    );
  }
  const {NavigationHandler} = await import('navigation-react');
  const root = React.createElement(
    React.Fragment,
    null,
    React.createElement(
      NavigationHandler,
      {stateNavigator: navigator},
      el)
  );
  const {pipe} = renderToPipeableStream(req.accepts('text/html') ? {root} : root, moduleMap);
  pipe(res);
}

app.get('*', async function (req, res) {
  const m = await import('../src/App.js');
  const App = m.default.default || m.default;
  const serverNavigator = new StateNavigator(stateNavigator.default);
  serverNavigator.navigateLink(req.url);
  await renderApp(req, res, React.createElement(App, {url: req.url}), serverNavigator);
});

app.post('*', async function (req, res) {
  const sceneViews = {
    people: await import('../src/People.js'),
    person: await import('../src/Person.js'),
    friends: await import('../src/Friends.js')
  };
  const {url, sceneViewKey} = req.body;
  const View = sceneViews[sceneViewKey].default;
  const serverNavigator = new StateNavigator(stateNavigator.default);
  serverNavigator.navigateLink(url);
  await renderApp(req, res, React.createElement(View), serverNavigator);
});

app.put('*', async (req, res) => {
  const m = await import('../src/App.js');
  const App = m.default.default || m.default;
  const serverNavigator = new StateNavigator(stateNavigator.default);
  const {state, data, crumbs} = req.body;
  let fluentNavigator = serverNavigator.fluent();
  for (let i = 0; i < crumbs.length; i++) {
    fluentNavigator = fluentNavigator.navigate(crumbs[i].state, crumbs[i].data);
  }
  fluentNavigator = fluentNavigator.navigate(state, data);
  serverNavigator.navigateLink(fluentNavigator.url);
  await renderApp(req, res, React.createElement(App, {url: fluentNavigator.url}), serverNavigator);
});

app.listen(3001, () => {
  console.log('Server listening on port 3001...');
});
