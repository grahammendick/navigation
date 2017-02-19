import React from 'react';
import {Dimensions, StyleSheet, Text, View, TouchableHighlight, PanResponder} from 'react-native';
import {NavigationBackAndroid, spring} from 'navigation-react-native';

export default class Next extends React.Component {
  constructor(props) {
    super(props);
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this.handleMoveShouldSetPanResponder.bind(this),
      onPanResponderMove: this.handlePanResponderMove.bind(this),
      onPanResponderRelease: this.handlePanResponderEnd.bind(this),
      onPanResponderTerminate: this.handlePanResponderEnd.bind(this),
    });
  }
  handleMoveShouldSetPanResponder(e, gestureState) {
    var {stateNavigator} = this.props; 
    return stateNavigator.canNavigateBack(1);
  }
  handlePanResponderMove(e, gestureState) {
    var {moveScene} = this.props; 
    moveScene({translate: Math.max(0, gestureState.dx) / Dimensions.get('window').width});
  }
  handlePanResponderEnd(e, gestureState) {
    var {moveScene, stateNavigator} = this.props; 
    if (gestureState.dx / Dimensions.get('window').width < 0.4)
      moveScene(null);
    else
      stateNavigator.navigateBack(1);
  }
  render() {
    const {stateNavigator} = this.props;
    const {url, crumbs} = stateNavigator.stateContext;
    return (
      <View
        style={[
          {backgroundColor: crumbs.length % 2 === 0 ? '#036' : '#f36207'},
          styles.scene
        ]}
        {...this.panResponder.panHandlers}
        >
        <NavigationBackAndroid stateNavigator={stateNavigator} />
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => {
            if (url === stateNavigator.stateContext.url)
              stateNavigator.navigate('scene');
        }}>
          <Text style={styles.text}>Scene {crumbs.length}</Text>
        </TouchableHighlight>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
});
