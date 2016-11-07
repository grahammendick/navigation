import Back from './Back.js';
import ComponentA from './ComponentA.js';
import ComponentB from './ComponentB.js';
import { StateNavigator } from 'navigation';
import SceneNavigator from './SceneNavigator.js';
import React from 'react';
import ReactDOM from 'react-dom';

var stateNavigator = new StateNavigator([
    { key: 'first', renderScene: () => ({component: ComponentA, props: {title: "First", stateNavigator, next: 'second'}}) },
    { key: 'second', trackCrumbTrail: true, renderScene: () => ({component: ComponentA, props: {title: "Second", stateNavigator, next: 'third'}}) },
    { key: 'third', trackCrumbTrail: true, renderScene: () => ({component: ComponentB, props: {title: "Third", stateNavigator}}) }
]);

stateNavigator.start('/first');

ReactDOM.render(
    <div>
        <Back stateNavigator={stateNavigator} />
        <SceneNavigator stateNavigator={stateNavigator} />
    </div>,
    document.getElementById('content')
);
