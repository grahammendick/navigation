import React, {Component} from 'react';
import {AppRegistry, StyleSheet, View} from 'react-native';
import createStateNavigator from './createStateNavigator';
import Footer from './Footer';
import Twitter from './Twitter';

const timelineStateNavigator = createStateNavigator();
const notificationsStateNavigator = createStateNavigator();

export default class TwitterIOS extends Component {
  constructor(props) {
    super(props);
    this.state = {activeTab: 'timeline'};
    this.onTimeline = this.onTimeline.bind(this);
    this.onNotifications = this.onNotifications.bind(this);
  }
  onTimeline() {
    this.onTab('timeline', timelineStateNavigator);
  }
  onNotifications() {
    this.onTab('notifications', notificationsStateNavigator);
  }
  onTab(tabName, stateNavigator) {
    const {activeTab} = this.state;
    if (activeTab === tabName) {
      const crumbCount = stateNavigator.stateContext.crumbs.length
      if (crumbCount)
        stateNavigator.navigateBack(crumbCount);
    }
    else {
      this.setState({activeTab: tabName});
    }
  }
  render() {
    const {activeTab} = this.state;
    return (
      <View style={styles.app}>
        <Twitter
          stateNavigator={timelineStateNavigator}
          startStateKey="home"
          visible={activeTab === 'timeline'}
          offset={65} />
        <Twitter
          stateNavigator={notificationsStateNavigator}
          startStateKey="notifications"
          visible={activeTab === 'notifications'}
          offset={65} />
        <Footer
          activeTab={activeTab}
          onTimeline={this.onTimeline}
          onNotifications={this.onNotifications} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flex: 1,
  },
});

AppRegistry.registerComponent('twitter', () => TwitterIOS);
