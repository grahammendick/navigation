import React, {useContext, useState, useMemo} from 'react';
import {Platform} from 'react-native';
import {NavigationHandler, NavigationContext} from 'navigation-react';
import {NavigationStack, Scene, NavigationBar, TabBar, TabBarItem, useNavigated} from 'navigation-react-native';
import {StateNavigator} from 'navigation';
import Home from './Home';
import Notifications from './Notifications';
import Tweet from './Tweet';
import Timeline from './Timeline';
import {getFollows} from './data';

const useStateNavigator = () => {
  const {stateNavigator} = useContext(NavigationContext);
  return useMemo(() => {
    const navigator = new StateNavigator(stateNavigator);
    navigator.historyManager.disabled = true;
    navigator.historyManager.stop();
    return navigator;
  }, [])
};

export default () => {
  const [notified, setNotified] = useState(false);
  const homeNavigator = useStateNavigator();
  const notificationsNavigator = useStateNavigator();
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
    <>
      <NavigationBar hidden={true} />
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
          {Platform.OS === 'ios'
            ? (<NavigationHandler stateNavigator={homeNavigator}>
                <NavigationStack>
                  <Scene stateKey="home"><Home /></Scene>
                  <Scene stateKey="tweet"><Tweet /></Scene>
                  <Scene stateKey="timeline"><Timeline /></Scene>
                </NavigationStack>
              </NavigationHandler>)
            : <Home />}
        </TabBarItem>
        <TabBarItem
          title="Notifications"
          image={require('./notifications.png')}
          href={getHref(stateNavigator.getRefreshLink({tab: 'notifications'}))}
          badge={!notified ? '' + getFollows().length : null} 
          onPress={() => {setNotified(true)}}>
          {Platform.OS === 'ios'
            ? (<NavigationHandler stateNavigator={notificationsNavigator}>
                <NavigationStack>
                  <Scene stateKey="notifications"><Notifications /></Scene>
                  <Scene stateKey="tweet"><Tweet /></Scene>
                  <Scene stateKey="timeline"><Timeline /></Scene>
                </NavigationStack>
              </NavigationHandler>)
            : <Notifications />}
        </TabBarItem>
      </TabBar>
    </>
  );
}
