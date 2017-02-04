import React from 'react';
import {Dimensions, StyleSheet, Text, View, TouchableHighlight, PanResponder} from 'react-native';

export default class Next extends React.Component {
  constructor(props) {
    super(props);
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder.bind(this),
      onMoveShouldSetPanResponder: this.handleMoveShouldSetPanResponder.bind(this),
      onPanResponderMove: this.handlePanResponderMove.bind(this),
      onPanResponderRelease: this.handlePanResponderEnd.bind(this),
      onPanResponderTerminate: this.handlePanResponderEnd.bind(this),
    });
  }
  handleStartShouldSetPanResponder(e, gestureState) {
    return true;
  }
  handleMoveShouldSetPanResponder(e, gestureState) {
    return true;
  }
  handlePanResponderMove(e, gestureState) {
    var {moveScene} = this.props; 
    var {dx} = gestureState;
    moveScene({translate: Math.max(0, dx) / Dimensions.get('window').width});
  }
  handlePanResponderEnd(e, gestureState) {
    var {moveScene, stateNavigator} = this.props; 
    if (gestureState.dx / Dimensions.get('window').width < 0.5)
      moveScene(null);
    else
      stateNavigator.navigateBack(1);
  }
  render() {
    const {stateNavigator} = this.props;
    const {url} = stateNavigator.stateContext;
    return (
      <View
        style={styles.scene}
        {...this.panResponder.panHandlers}
        >
        <TouchableHighlight
          underlayColor="white"
          onPress={() => {
            if (url === stateNavigator.stateContext.url)
              stateNavigator.navigate('next');
        }}>
          <Text>Next</Text>
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
});
