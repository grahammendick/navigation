import React from 'react';
import {StateNavigator} from 'navigation';
import {MobileHistoryManager} from 'navigation-react-mobile';
import Home from './Home';
import Tweet from './Tweet';
import Timeline from './Timeline';
import Photo from './Photo';
import {getHome, getTweet, getTimeline} from './data';

export default () => {
  const buildCurrentUrl = url => {
    const {state, data} = stateNavigator.parseLink(url);
    const {previousState} = stateNavigator.stateContext;
    var fluent = stateNavigator.fluent().navigate('home');
    if (!previousState)
      stateNavigator.historyManager.addHistory(fluent.url, true);
    if (state.key === 'photo') {
      fluent = fluent.navigate('tweet', {id: data.id});
      if (!previousState)
        stateNavigator.historyManager.addHistory(fluent.url);
    }
    return fluent.navigate(state.key, data).url;
  };

  const stateNavigator = new StateNavigator([
    {key: 'home', route: ''},
    {key: 'tweet', trackCrumbTrail: true},
    {key: 'timeline', trackCrumbTrail: true},
    {key: 'photo', trackCrumbTrail: true}
  ], new MobileHistoryManager(buildCurrentUrl));

  const {home, tweet, timeline, photo} = stateNavigator.states;
  home.renderScene = () => <Home tweets={getHome()} />;
  tweet.renderScene = ({id}) => <Tweet tweet={getTweet(id)} />;
  timeline.renderScene = ({id}) => <Timeline timeline={getTimeline(id)} />;
  photo.renderScene = ({id}) => <Photo photo={getTweet(id).photo} />;
  
  return stateNavigator;
}
