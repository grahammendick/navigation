import React from 'react';
import {TabBar, TabBarItem} from 'navigation-react-native';
import Home from './Home';
import Notifications from './Notifications';

export default ({tweets, follows}) => (
  <TabBar bottomTabs={true} swipeable={false}>
    <TabBarItem title="Home">
      <Home tweets={tweets} follows={follows} />
    </TabBarItem>
    <TabBarItem title="Notifications">
      <Notifications follows={follows} />
    </TabBarItem>
  </TabBar>
);
