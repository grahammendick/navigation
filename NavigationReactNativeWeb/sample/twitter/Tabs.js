import React, {useContext, useState} from 'react';
import {NavigationContext} from 'navigation-react';
import {TabBar, TabBarItem} from 'navigation-react-native';
import Home from './Home';
import Notifications from './Notifications';

export default ({tweets, follows}) => {
  const {stateNavigator} = useContext(NavigationContext);
  const [tab, setTab] = useState(0);
  const getHref = link => stateNavigator.historyManager.getHref(link);
  return (
    <TabBar
      tab={tab}
      bottomTabs={true}
      swipeable={false}
      selectedTintColor="deepskyblue"
      onChangeTab={(selectedTab, e) => {
        if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey || e.button) return
        e.preventDefault();
        setTab(selectedTab);
      }}>
      <TabBarItem
        title="Home"
        image={require('./home.png')}
        href={getHref(stateNavigator.getRefreshLink({tab: 'home'}))}>
        <Home tweets={tweets} follows={follows} />
      </TabBarItem>
      <TabBarItem
        title="Notifications"
        image={require('./notifications.png')}
        href={getHref(stateNavigator.getRefreshLink({tab: 'notifications'}))}>
        <Notifications follows={follows} />
      </TabBarItem>
    </TabBar>
  );
}
