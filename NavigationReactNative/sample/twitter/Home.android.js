import React from 'react';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import Tweets from './Tweets';
import Follows from './Follows';

export default ({tweets, follows, stateNavigator}) => (
  <ScrollableTabView 
      renderTabBar={() => <DefaultTabBar
        style={{marginTop: 20}}
        activeTextColor="#1da1f2"
        inactiveTextColor="#657786"
        underlineStyle={{backgroundColor: '#1da1f2'}} />}>
      <Tweets tweets={tweets} stateNavigator={stateNavigator} tabLabel="Timeline" />
      <Follows follows={follows} stateNavigator={stateNavigator} tabLabel="Notification" />
  </ScrollableTabView>
);
