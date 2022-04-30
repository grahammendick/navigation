import React, {useContext, useState} from 'react';
import {Platform} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {TabBar, TabBarItem, useNavigated} from 'navigation-react-native';
import Home from './Home';
import Notifications from './Notifications';
import {getHome, getFollows} from './data';

export default () => {
  const {stateNavigator, data} = useContext(NavigationContext);
  const tabs = {home: 0, notifications: 1};
  const [tab, setTab] = useState(tabs[data.tab]);
  const getHref = link => stateNavigator.historyManager.getHref(link);
  useNavigated(() => {
    if (Platform.OS === 'web') {
      document.title = !tabs[data.tab] ? 'Home' : 'Notifications';
      setTab(tabs[data.tab])
    }
  });
  return (
    <TabBar
      tab={tab}
      primary={true}
      bottomTabs={true}
      barTintColor="#fff"
      selectedTintColor="deepskyblue"
      onChangeTab={(selectedTab) => {
        if (Platform.OS === 'web') {
          if (selectedTab === 1)
            stateNavigator.refresh({tab: 'notifications'});
          else
            history.back();
        } else {
          setTab(selectedTab);
        }
      }}>
      <TabBarItem
        title="Home"
        image={require('./home.png')}
        href={getHref(stateNavigator.getRefreshLink({tab: 'home'}))}>
        <Home tweets={getHome()} />
      </TabBarItem>
      <TabBarItem
        title="Notifications"
        image={require('./notifications.png')}
        href={getHref(stateNavigator.getRefreshLink({tab: 'notifications'}))}>
        <Notifications follows={getFollows()} />
      </TabBarItem>
    </TabBar>
  );
}
