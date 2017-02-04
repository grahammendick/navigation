import React from 'react';
import {StateNavigator} from 'navigation';
import Home from './Home';
import Next from './Next';

export default () => {
  const stateNavigator = new StateNavigator([
    {key: 'home'},
    {key: 'next', trackCrumbTrail: true},
  ]);

  const { home, next } = stateNavigator.states;
  home.renderScene = () => <Home stateNavigator={stateNavigator}/>;
  next.renderScene = (data, asyncData, moveScene) => <Next moveScene={moveScene} stateNavigator={stateNavigator}/>;
  
  return stateNavigator;
}
