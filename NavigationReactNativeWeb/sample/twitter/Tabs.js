import React, {useContext, useState} from 'react';
import {Platform} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {TabBar, TabBarItem, useNavigated} from 'navigation-react-native';
import Home from './Home';
import Notifications from './Notifications';

export default ({tweets, follows}) => {
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
      selectedTintColor="deepskyblue"
      onChangeTab={(selectedTab, e) => {
        if (Platform.OS === 'web') {
          if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey || e.button) return;
          e.preventDefault();
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
