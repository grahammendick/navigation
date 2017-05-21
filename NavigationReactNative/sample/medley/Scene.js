import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import {NavigationBackHandler} from 'navigation-react-native';

const nextDirection = {
  North: 'East',
  East: 'South',
  South: 'West',
  West: 'North',
};

export default class Scene extends React.Component {
  constructor(props, context) {
    super(props, context);
    const {url, crumbs} = props.stateNavigator.stateContext;
    this.url = url;
    this.crumbs = crumbs;
  }
  shouldComponentUpdate(props) {
    return this.url === props.stateNavigator.stateContext.url;
  }
  render() {
    const {direction, color, stateNavigator} = this.props;
    return (
      <View style={[
        styles.scene,
        {backgroundColor: color}
      ]}>
        <NavigationBackHandler stateNavigator={stateNavigator} />
        <TouchableHighlight
          underlayColor={color}
          onPress={() => {
            if (this.url === stateNavigator.stateContext.url)
              stateNavigator.navigate(`scene${nextDirection[direction]}`);
        }}>
          <Text style={styles.text}>{direction} {this.crumbs.length}</Text>
        </TouchableHighlight>
        {stateNavigator.canNavigateBack(1) && <TouchableHighlight
          underlayColor={color}
          onPress={() => {
            if (this.url === stateNavigator.stateContext.url)
              stateNavigator.navigateBack(1);
        }}>
          <Text style={styles.text}>Back</Text>
        </TouchableHighlight>}
      </View>
    )
  }
}

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
