import React from 'react';
import {StateNavigator} from 'navigation';
import Grid from './Grid';
import Detail from './Detail';

const colors = [
  'maroon', 'red', 'crimson', 'orange', 'brown', 'sienna', 'olive',
  'purple', 'fuchsia', 'indigo', 'green', 'navy', 'blue', 'teal', 'black'
];

export default () => {
  const stateNavigator = new StateNavigator([
    {key: 'grid', title: 'Colors', route: ''},
    {key: 'detail', title: 'Color', route: '{color}', trackCrumbTrail: true},
  ]);

  const {grid, detail} = stateNavigator.states;
  grid.renderScene = () => <Grid colors={colors} />;
  detail.renderScene = ({color}) => <Detail colors={colors} color={color} />;
  
  detail.truncateCrumbTrail = (state, data, crumbs) => (
    crumbs.slice(-1)[0].state === detail ? crumbs.slice(0, -1) : crumbs
  );

  return stateNavigator;
}
