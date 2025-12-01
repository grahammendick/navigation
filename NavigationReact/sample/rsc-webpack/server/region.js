'use strict';

const path = require('path');

const register = require('react-server-dom-webpack/node-register');
register();

const babelRegister = require('@babel/register');
babelRegister({
  babelrc: false,
  ignore: [
    /\/(build|node_modules)\//,
    function (file) {
      if ((path.dirname(file) + '/').startsWith(__dirname + '/')) {
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
  const {url, sceneViewKey, historyAction, rootViews} = req.body;
  const serverNavigator = new StateNavigator(stateNavigator.default);
  serverNavigator.navigateLink(url, historyAction);
  const {state, oldState} = serverNavigator.stateContext;
  const activeViews = oldState ? Object.keys(rootViews).reduce((activeRoots, rootKey) => {
      const active = rootViews[rootKey];
      const show =  active != null && (
          typeof active === 'string' ? state.key === active : active.indexOf(state.key) !== -1
      );
      if (show) activeRoots.push(rootKey);
      return activeRoots;
    }, []) : [sceneViewKey];
  const {renderToPipeableStream} = await import(
    'react-server-dom-webpack/server'
  );
  const moduleMap = await getModuleMap();
  const {pipe} = renderToPipeableStream({
    url: oldState ? serverNavigator.stateContext.url : undefined,
    historyAction: oldState ? serverNavigator.stateContext.historyAction : undefined,
    sceneViews: activeViews.reduce((SceneViews, activeKey) => {
      const SceneView = sceneViews[activeKey].default;
      SceneViews[activeKey] = (
        renderSceneView(React.createElement(SceneView), serverNavigator)
      );
      return SceneViews;
    }, {})
  }, moduleMap);
  pipe(res);
});

app.listen(3001, () => {
  console.log('Server listening on port 3001...');
});
