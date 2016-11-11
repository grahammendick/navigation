import {getHome, getTweet} from './data.js';
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
home.renderScene = () => <Home tweets={getHome()} stateNavigator={stateNavigator}/>;
tweet.renderScene = ({id}) => <Tweet tweet={getTweet(id)} stateNavigator={stateNavigator}/>;

tweet.truncateCrumbTrail = (state, crumbs) => crumbs;

stateNavigator.start('/home');

ReactDOM.render(
    <Twitter stateNavigator={stateNavigator} />,
    document.getElementById('content')
);
