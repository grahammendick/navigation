import Home from './Home.js';
import Tweet from './Tweet.js';
import Twitter from './Twitter.js';
import {StateNavigator} from 'navigation';
import React from 'react';
import ReactDOM from 'react-dom';

var stateNavigator = new StateNavigator([
    {key: 'home'},
    {key: 'tweet', trackCrumbTrail: true}
]);

var {home, tweet} = stateNavigator.states;
home.renderScene = () => <Home stateNavigator={stateNavigator}/>;
tweet.renderScene = () => <Tweet stateNavigator={stateNavigator}/>;

stateNavigator.start('/home');

ReactDOM.render(
    <Twitter stateNavigator={stateNavigator} />,
    document.getElementById('content')
);
