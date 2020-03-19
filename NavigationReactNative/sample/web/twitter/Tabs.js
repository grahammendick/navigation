import React, {useContext} from 'react';
import {NavigationContext} from 'navigation-react';
import {TabBar, TabBarItem} from 'navigation-react-native';
import Home from './Home';
import Notifications from './Notifications';

export default ({tweets, follows, tab}) => {
  const {stateNavigator} = useContext(NavigationContext);
  return (
    <TabBar
      selectedIndex={tab}
      bottomTabs={true}
      swipeable={false}
      selectedTintColor="deepskyblue">
      <TabBarItem
        title="Home"
        image={require('./home.png')}
        link={stateNavigator.getRefreshLink({tab: 0})}>
        <Home tweets={tweets} follows={follows} />
      </TabBarItem>
      <TabBarItem
        title="Notifications"
        image={require('./notifications.png')}
        link={stateNavigator.getRefreshLink({tab: 1})}>
        <Notifications follows={follows} />
      </TabBarItem>
    </TabBar>
  );
}
