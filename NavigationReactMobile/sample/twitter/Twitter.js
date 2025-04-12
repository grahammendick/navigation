import React from 'react';
import {NavigationStack, Scene} from 'navigation-react-mobile';
import Home from './Home';
import Tweet from './Tweet';
import Timeline from './Timeline';
import Photo from './Photo';

export default () => (
  <NavigationStack
    unmountStyle={[{transform: 'translateX(100%)'}, {transform: 'translateX(0)'}]}
    crumbStyle={[{transform: 'translateX(5%) scale(0.9)', opacity: 0},{transform: 'translateX(0) scale(1)', opacity: 1}]}
    className="scene">
    <Scene stateKey="home"><Home /></Scene>
    <Scene stateKey="tweet"><Tweet /></Scene>
    <Scene stateKey="timeline"><Timeline /></Scene>
    <Scene stateKey="photo"
      unmountStyle={(data, crumbs) => !photoTweet(data, crumbs) ? [{opacity: 0}, {opacity: 1}] : [{transform: 'translateX(100%)'}, {transform: 'translateX(0)'}]}
      sharedElements={(data, crumbs) => !photoTweet(data, crumbs) ? [`photo${data.id}`] : null}>
      <Photo />
    </Scene>
  </NavigationStack>
);

const photoTweet = (data, crumbs) => {
  const { state: previousState, data: previousData } = crumbs[crumbs.length - 1];
  return previousState.key === 'tweet' && previousData.id === data.id;

}
