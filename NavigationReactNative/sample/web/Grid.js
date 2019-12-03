import React from 'react';
import {StyleSheet, ScrollView, View, TouchableHighlight} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {NavigationBarIOS, SharedElement} from 'navigation-react-native';

export default ({colors}) => (
  <NavigationContext.Consumer>
    {({stateNavigator}) => (
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <NavigationBarIOS title="Colors" />
        <View style={styles.colors}>
          {colors.map(color => (
            <TouchableHighlight
              key={color}
              style={styles.color}
              underlayColor={color}                
              accessibilityRole="link"
              href={stateNavigator.historyManager.getHref(
                stateNavigator.getNavigationLink('detail', {color})
              )}
              onPress={() => {
                stateNavigator.navigate('detail', {color});
              }}>
              <SharedElement name={color} data={{color}} style={{flex: 1}}>
                <View style={{backgroundColor: color, flex: 1}} />
              </SharedElement>
            </TouchableHighlight>
          ))}
        </View>
      </ScrollView>
    )}
  </NavigationContext.Consumer>
);

const styles = StyleSheet.create({
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