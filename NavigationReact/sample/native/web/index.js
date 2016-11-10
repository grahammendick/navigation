import Back from './Back.js';
import ComponentA from './ComponentA.js';
import ComponentB from './ComponentB.js';
import Home from './Home.js';
import Twitter from './Twitter.js';
import {StateNavigator} from 'navigation';
import React from 'react';
import ReactDOM from 'react-dom';

var stateNavigator = new StateNavigator([
    {key: 'first'},
    {key: 'second', trackCrumbTrail: true},
    {key: 'third', trackCrumbTrail: true}
]);

var {first, second, third} = stateNavigator.states;
first.renderScene = () => <Home stateNavigator={stateNavigator}/>;
second.renderScene = () => <ComponentA title="Second" stateNavigator={stateNavigator} next="third"/>;
third.renderScene = () => <ComponentB title="Third" stateNavigator={stateNavigator}/>;

stateNavigator.start('/first');
//stateNavigator.start('/third?crumb=%2Ffirst&crumb=%2Fsecond');

ReactDOM.render(
    <Twitter stateNavigator={stateNavigator} />,
    document.getElementById('content')
);
