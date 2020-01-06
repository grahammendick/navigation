import React from 'react';
import {TabBar, TabBarItem} from 'navigation-react-native';
import Home from './Home';
import Notifications from './Notifications';

export default ({tweets, follows}) => (
  <TabBar bottomTabs={true} swipeable={false} selectedTintColor="deepskyblue">
    <TabBarItem title="Home" image={require('./home.png')}>
      <Home tweets={tweets} follows={follows} />
    </TabBarItem>
    <TabBarItem title="Notifications" image={require('./notifications.png')}>
      <Notifications follows={follows} />
    </TabBarItem>
  </TabBar>
);
