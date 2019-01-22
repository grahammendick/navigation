import React from 'react';
import {StyleSheet, ScrollView, Text, View, TouchableHighlight} from 'react-native';
import {NavigationContext} from 'navigation-react';

export default ({colors}) => (
  <NavigationContext.Consumer>
    {({stateNavigator}) => (
      <ScrollView contentInsetAdjustmentBehavior="automatic">
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
              <View style={{flex: 1}}>
                <View style={{backgroundColor: color, flex: 1}} />
              </View>
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