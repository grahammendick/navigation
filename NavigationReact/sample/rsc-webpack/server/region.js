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

async function getModuleMap() {
  if (process.env.NODE_ENV === 'development') {
    return await (
      await fetch('http://localhost:3000/react-client-manifest.json')
    ).json();
  } else {
    return JSON.parse(
      await readFile(
        path.resolve(__dirname, `../build/react-client-manifest.json`),
        'utf8'
      )
    );
  }
}

async function renderSceneView(el, navigator) {
  const {NavigationHandler} = await import('navigation-react');
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      NavigationHandler,
      {stateNavigator: navigator},
      el)
  );

}

app.get('*', async function (req, res) {
  const m = await import('../src/App.js');
  const App = m.default.default || m.default;
  const serverNavigator = new StateNavigator(stateNavigator.default);
  serverNavigator.navigateLink(req.url);
  const {renderToPipeableStream} = await import(
    'react-server-dom-webpack/server'
  );
  const moduleMap = await getModuleMap();
  const root = renderSceneView(React.createElement(App, {url: req.url}), serverNavigator);
  const {pipe} = renderToPipeableStream(root, moduleMap);
  pipe(res);
});

app.post('*', async function (req, res) {
  const sceneViews = {
    people: await import('../src/People.js'),
    list: await import('../src/List.js'),
    person: await import('../src/Person.js'),
    friends: await import('../src/Friends.js')
  };
  const {url, sceneViewKey} = req.body;
  const View = sceneViews[sceneViewKey].default;
  const serverNavigator = new StateNavigator(stateNavigator.default);
  serverNavigator.navigateLink(url);
  const {renderToPipeableStream} = await import(
    'react-server-dom-webpack/server'
  );
  const moduleMap = await getModuleMap();
  const root = renderSceneView(React.createElement(View), serverNavigator);
  const {pipe} = renderToPipeableStream(root, moduleMap);
  pipe(res);
});

app.listen(3001, () => {
  console.log('Server listening on port 3001...');
});
