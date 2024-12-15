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

const stateNavigator = new StateNavigator([
  {key: 'grid'},
  {key: 'detail', trackCrumbTrail: true},
]);

const { grid, detail } = stateNavigator.states;
grid.renderScene = () => <Grid colors={colors}/>;
detail.renderScene = (data) => <Detail colors={colors} {...data}/>;

stateNavigator.navigate('grid');

const openLink = (url) => {
  if (url) {
    var color = url.split('=')[1];
    var {data} = stateNavigator.stateContext;
    var {search} = data;
    var url = stateNavigator.fluent()
      .navigate('grid')
      .navigate('detail', {color, search}).url;
    stateNavigator.navigateLink(url);
  }
};

Linking.getInitialURL().then(openLink);
Linking.addEventListener('url', ({url}) => openLink(url));

const App = () => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <NavigationStack
      sharedElement={(_, {color, search}) => !search ? color : null} />
  </NavigationHandler>
);
export default App;
