import React from 'react';
import {TabBar, TabBarItem} from 'navigation-react-native';
import Home from './Home';
import Notifications from './Notifications';

export default ({tweets, notifications}) => (
  <TabBar bottomTabs={true} swipeable={false} selectedTintColor="#1da1f2">
    <TabBarItem title="Home" image={require('./home.png')}>
      <Home tweets={tweets} notifications={notifications} />
    </TabBarItem>
    <TabBarItem title="Notifications" image={require('./notifications.png')}>
      <Notifications notifications={notifications} />
    </TabBarItem>
  </TabBar>
);
