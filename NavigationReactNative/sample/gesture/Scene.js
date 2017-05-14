import React from 'react';
import {Dimensions, StyleSheet, Text, View, TouchableHighlight, PanResponder} from 'react-native';
import {NavigationBackHandler, spring} from 'navigation-react-native';

export default class Next extends React.Component {
  constructor(props) {
    super(props);
    const {url, crumbs} = props.stateNavigator.stateContext;
    this.url = url;
    this.crumbs = crumbs;
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this.handleMoveShouldSetPanResponder.bind(this),
      onPanResponderMove: this.handlePanResponderMove.bind(this),
      onPanResponderRelease: this.handlePanResponderEnd.bind(this),
      onPanResponderTerminate: this.handlePanResponderEnd.bind(this),
    });
  }
  shouldComponentUpdate(props) {
    return this.url === props.stateNavigator.stateContext.url;
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
    return (
      <View
        style={[
          {backgroundColor: this.crumbs.length % 2 === 0 ? '#036' : '#f36207'},
          styles.scene
        ]}
        {...this.panResponder.panHandlers}
        >
        <NavigationBackHandler stateNavigator={stateNavigator} />
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => {
            if (this.url === stateNavigator.stateContext.url)
              stateNavigator.navigate('scene');
        }}>
          <Text style={styles.text}>Scene {this.crumbs.length}</Text>
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
