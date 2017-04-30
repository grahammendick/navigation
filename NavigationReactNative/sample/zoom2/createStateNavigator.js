import React from 'react';
import {StateNavigator} from 'navigation';
import List from './List';
import Detail from './Detail';

export default () => {
  const stateNavigator = new StateNavigator([
    {key: 'list'},
    {key: 'detail', trackCrumbTrail: true},
  ]);

  const { list, detail } = stateNavigator.states;
  list.renderScene = data => <List stateNavigator={stateNavigator}/>;
  detail.renderScene = data => <Detail {...data} stateNavigator={stateNavigator}/>;
  
  return stateNavigator;
}
