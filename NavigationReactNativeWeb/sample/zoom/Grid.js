import React, {useContext} from 'react';
import {StyleSheet, ScrollView, View, TouchableHighlight, Platform} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {NavigationBar, SharedElement, useNavigated} from 'navigation-react-native';

export default ({colors}) => {
  const {stateNavigator} = useContext(NavigationContext);
  useNavigated(() => {
    if (Platform.OS === 'web') document.title = 'Colors';
  });
  return (
      <>
        <NavigationBar title="Colors" barTintColor="#fff" />
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
                onPress={(e) => {
                  if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey || e.button) return
                  e.preventDefault()
                  stateNavigator.navigate('detail', {color});
                }}>
                <SharedElement name={color} data={{color}} style={{flex: 1}}>
                  <View style={{backgroundColor: color, flex: 1}} />
                </SharedElement>
              </TouchableHighlight>
            ))}
          </View>
        </ScrollView>
      </>
  );
}

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