import React from 'react';
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {NavigationStack} from 'navigation-react-native';
import {Linking} from 'react-native';
import Grid from './Grid';
import Detail from './Detail';

const colors = [
  'maroon', 'red', 'crimson', 'orange', 'brown', 'sienna', 'olive',
  'purple', 'fuchsia', 'indigo', 'green', 'navy', 'blue', 'teal', 'black'
];

var stateNavigator = new StateNavigator([
  {key: 'grid'},
  {key: 'detail', trackCrumbTrail: true},
]);

const { grid, detail } = stateNavigator.states;
grid.renderScene = () => <Grid colors={colors}/>;
detail.renderScene = (data) => <Detail colors={colors} {...data}/>;

stateNavigator.navigate('grid');

detail.truncateCrumbTrail = (state, data, crumbs) => (
  crumbs.slice(-1)[0].state === detail ? crumbs.slice(0, -1) : crumbs
);

var openLink = (url) => {
  if (url) {
    var color = url.split('=')[1];
    var {state, data} = stateNavigator.stateContext;
    if (state === detail) {
      const {filter, search} = data;
      const suffix = search ? '_search' : '';
      const matched = !filter || color.indexOf(filter.toLowerCase()) !== -1;
      const name = matched ? color + suffix : null;
      stateNavigator.navigate('detail', {color, name, filter, search});
    } else {
      stateNavigator.navigate('detail', {color, name: color});
    }
  }
};

Linking.getInitialURL().then(openLink);
Linking.addEventListener('url', ({url}) => openLink(url));

export default () => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <NavigationStack sharedElements={(_, {name}) => name && [name]} />
  </NavigationHandler>
);
