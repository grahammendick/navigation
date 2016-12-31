import React, {Component} from 'react';
import {Dimensions, AppRegistry, StyleSheet, View} from 'react-native';
import {SceneNavigator, spring} from 'navigation-react-native';
import createStateNavigator from './createStateNavigator';
import Footer from './Footer';

const timelineStateNavigator = createStateNavigator();
const notificationsStateNavigator = createStateNavigator();

const getStyle = (translate, scale, opacity) => ({
  translate: spring(translate),
  scale: spring(scale),
  opacity: spring(opacity)
});

export default class Twitter extends Component {
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
        <TabSceneNavigator
          stateNavigator={timelineStateNavigator}
          startStateKey="home"
          visible={activeTab === 'timeline'} />
        <TabSceneNavigator
          stateNavigator={notificationsStateNavigator}
          startStateKey="notifications"
          visible={activeTab === 'notifications'} />
        <Footer
          activeTab={activeTab}
          onTimeline={this.onTimeline}
          onNotifications={this.onNotifications} />
      </View>
    );
  }
}

const TabSceneNavigator = ({stateNavigator, startStateKey, visible}) => (
  <SceneNavigator
    startStateKey={startStateKey}
    unmountedStyle={getStyle(1, 1, 1)}
    mountedStyle={getStyle(0, 1, 1)}
    crumbStyle={getStyle(0.05, 0.9, 0)}
    stateNavigator={stateNavigator}>
    {({translate, scale, opacity}, scene, active) => (
        <Scene
          visible={visible}
          scale={scale}
          translate={translate}
          opacity={opacity}
          pointerEvents={active ? 'auto' : 'none'}
          dimensions={Dimensions.get('window')}>
          {scene}
        </Scene>
    )}
  </SceneNavigator>
);

const Scene = ({visible, translate, scale, opacity, pointerEvents,
  dimensions: {width, height}, children}) => (
  <View
    pointerEvents={pointerEvents}
    style={[
      styles.scene,
      {
        top: visible ? 0 : -height,
        width: width,
        height: height -65,
        opacity: opacity,
        transform: [
          {translateX: width * translate},
          {scale: scale},
        ]
      }
    ]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  app: {
    flexDirection: 'row',
    flex: 1,
  },
  scene: {
    backgroundColor: 'white',
    position: 'absolute',
  },
});

AppRegistry.registerComponent('twitter', () => Twitter);
