import React from 'react';
import {StyleSheet, ScrollView, View, TouchableHighlight} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {SharedElementAndroid, SearchBarIOS} from 'navigation-react-native';

const Colors = ({colors, children}) => (
  <NavigationContext.Consumer>
    {({stateNavigator}) => (
      <ScrollView
        style={styles.scene}
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.colors}>
          {colors.map(color => (
            <TouchableHighlight
              key={color}
              style={styles.color}
              underlayColor={color}                
              onPress={() => {
                stateNavigator.navigate('detail', {color});
              }}>
              <SharedElementAndroid name={color} style={{flex: 1}}>
                <View style={{backgroundColor: color, flex: 1}} />
              </SharedElementAndroid>
            </TouchableHighlight>
          ))}
          {children}
        </View>
      </ScrollView>
    )}
  </NavigationContext.Consumer>
);

export default class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }
  render() {
    const {colors} = this.props;
    const {text} = this.state;
    const matchedColors = colors.filter(color => (
      color.indexOf(text.toLowerCase()) !== -1
    ));
    return (
      <Colors colors={colors}>
        <SearchBarIOS
          text={text}
          autoCapitalize="none"
          obscureBackground={false}
          onChangeText={text => this.setState({text})}>
          <Colors colors={matchedColors} />
        </SearchBarIOS>
      </Colors>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    backgroundColor: '#fff',
  },
  colors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  color: {
    width: 100,
    height: 150,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
  },
});