import React from 'react';
import {StateNavigator} from 'navigation';
import List from './List';
import Detail from './Detail';
import places from './data';

export default () => {
  const stateNavigator = new StateNavigator([
    {key: 'list'},
    {key: 'detail', trackCrumbTrail: true},
  ]);

  const { list, detail } = stateNavigator.states;
  list.renderScene = data => <List places={places} stateNavigator={stateNavigator}/>;
  detail.renderScene = ({rowId}) => <Detail places={places[rowId]} stateNavigator={stateNavigator}/>;
  
  return stateNavigator;
}
