import React, {useState} from 'react';
import {TabBar, TabBarItem} from 'navigation-react-native';
import Home from './Home';
import Notifications from './Notifications';

export default ({tweets, follows}) => {
  const [notified, setNotified] = useState(false);
  return (
    <TabBar bottomTabs={true} swipeable={false} selectedTintColor="deepskyblue">
      <TabBarItem title="Home" image={require('./home.png')}>
        <Home tweets={tweets} follows={follows} />
      </TabBarItem>
      <TabBarItem
        title="Notifications"
        image={require('./notifications.png')}
        badge={!notified ? follows.length : null}
        onPress={() => {setNotified(true)}}>
        <Notifications follows={follows} />
      </TabBarItem>
    </TabBar>
  );
}
