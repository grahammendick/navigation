import ComponentA from './ComponentA.js';
import ComponentB from './ComponentB.js';
import { StateNavigator } from 'navigation';
import SceneNavigator from './SceneNavigator.js';
import React from 'react';
import ReactDOM from 'react-dom';

var stateNavigator = new StateNavigator([
    { key: 'first', renderScene: () => ({component: ComponentA, props: {title: "First", stateNavigator}}) },
    { key: 'second', trackCrumbTrail: true, renderScene: () => ({component: ComponentB, props: {title: "Second"}}) }
]);

stateNavigator.start('first');

ReactDOM.render(
    <SceneNavigator stateNavigator={stateNavigator} />,
    document.getElementById('content')
);
