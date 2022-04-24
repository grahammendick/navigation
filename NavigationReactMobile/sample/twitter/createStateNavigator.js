import React from 'react';
import {StateNavigator} from 'navigation';
import {MobileHistoryManager} from 'navigation-react-mobile';

export default () => {
  const buildStartUrl = url => {
    const {state, data} = stateNavigator.parseLink(url);
    let fluent = stateNavigator.fluent().navigate('home');
    if (state.key === 'photo')
      fluent = fluent.navigate('tweet', {id: data.id});
    return fluent.navigate(state.key, data).url;
  };

  const stateNavigator = new StateNavigator([
    {key: 'home', route: '', title: 'Home'},
    {key: 'tweet', trackCrumbTrail: true, title: 'Tweet'},
    {key: 'timeline', trackCrumbTrail: true, title: 'Timeline'},
    {key: 'photo', trackCrumbTrail: true, title: 'Photo'}
  ], new MobileHistoryManager(buildStartUrl));

  return stateNavigator;
}
