import React, {useState} from 'react';
import {TabBar, TabBarItem} from 'navigation-react-native';
import Home from './Home';
import Notifications from './Notifications';

export default ({tweets, notifications}) => {
  const [notified, setNotified] = useState(false);
  return (
    <TabBar primary={true} selectedTintColor="#1da1f2">
      <TabBarItem title="Home" image={require('./home.png')}>
        <Home tweets={tweets} notifications={notifications} />
      </TabBarItem>
      <TabBarItem
        title="Notifications"
        image={require('./notifications.png')}
        badge={!notified ? notifications.length : null} 
        onPress={() => {setNotified(true)}}>
        <Notifications notifications={notifications} />
      </TabBarItem>
    </TabBar>
  );
}
