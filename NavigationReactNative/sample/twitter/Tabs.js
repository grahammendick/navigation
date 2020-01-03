import React, {useState} from 'react';
import {TabBar, TabBarItem} from 'navigation-react-native';
import Home from './Home';
import Notifications from './Notifications';

export default ({tweets, follows}) => {
  const [notified, setNotified] = useState(false);
  return (
    <TabBar bottomTabs={true} swipeable={false}>
      <TabBarItem title="Home">
        <Home tweets={tweets} follows={follows} />
      </TabBarItem>
      <TabBarItem
        title="Notifications"
        badge={!notified ? follows.length : null}
        onPress={() => {setNotified(true)}}>
        <Notifications follows={follows} />
      </TabBarItem>
    </TabBar>
  );
};
