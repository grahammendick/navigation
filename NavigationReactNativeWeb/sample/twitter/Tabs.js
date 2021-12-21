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
      onChangeTab={(i, e) => {
        if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey || e.button) return
        e.preventDefault();
        setTab(i);
      }}>
      <TabBarItem
        title="Home"
        image={require('./home.png')}
        href={getHref(stateNavigator.getRefreshLink({tab: 0}))}>
        <Home tweets={tweets} follows={follows} />
      </TabBarItem>
      <TabBarItem
        title="Notifications"
        image={require('./notifications.png')}
        href={getHref(stateNavigator.getRefreshLink({tab: 1}))}>
        <Notifications follows={follows} />
      </TabBarItem>
    </TabBar>
  );
}
