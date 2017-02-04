import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight, PanResponder} from 'react-native';

export default class Next extends React.Component {
  constructor(props) {
    super(props);
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this.handleMoveShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd,
    });
  }
  handleStartShouldSetPanResponder(e, gestureState) {
    return true;
  }
  handleMoveShouldSetPanResponder(e, gestureState) {
    return true;
  }
  handlePanResponderGrant(e, gestureState) {
  }
  handlePanResponderMove(e, gestureState) {
  }
  handlePanResponderEnd(e, gestureState) {
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
