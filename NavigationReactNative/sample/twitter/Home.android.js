import React from 'react';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from './TabBar';
import Tweets from './Tweets';
import Follows from './Follows';

export default ({tweets, follows, stateNavigator}) => (
  <ScrollableTabView
    prerenderingSiblingsNumber={1}
    renderTabBar={() => <TabBar stateNavigator={stateNavigator} />}>
    <Tweets tweets={tweets} stateNavigator={stateNavigator} tabLabel="Timeline" />
    <Follows follows={follows} stateNavigator={stateNavigator} tabLabel="Notification" />
  </ScrollableTabView>
);
