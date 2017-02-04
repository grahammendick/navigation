import React from 'react';
import {Dimensions, StyleSheet, Text, View, TouchableHighlight, PanResponder} from 'react-native';

export default class Next extends React.Component {
  constructor(props) {
    super(props);
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder.bind(this),
      onMoveShouldSetPanResponder: this.handleMoveShouldSetPanResponder.bind(this),
      onPanResponderGrant: this.handlePanResponderGrant.bind(this),
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
  handlePanResponderGrant(e, gestureState) {
  }
  handlePanResponderMove(e, gestureState) {
    this.props.moveScene({translate: gestureState.dx / Dimensions.get('window').width});
  }
  handlePanResponderEnd(e, gestureState) {
    if (gestureState.dx / Dimensions.get('window').width < 0.5)
      this.props.moveScene(null);
    else
      this.props.stateNavigator.navigateBack(1);
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
