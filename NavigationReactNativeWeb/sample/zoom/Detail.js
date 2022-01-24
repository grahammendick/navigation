import React, {useContext} from 'react';
import {StyleSheet, ScrollView, Text, View, Platform, TouchableHighlight} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {NavigationBar, RightBar, BarButton, SharedElement, useNavigated} from 'navigation-react-native';

export default ({colors, color}) => {
  const {stateNavigator} = useContext(NavigationContext);
  useNavigated(() => {
    if (Platform.OS === 'web') document.title = 'Color';
  });
  return (
      <>
        <NavigationBar title="Color" barTintColor="#fff">
          <RightBar>
            <BarButton
              systemItem="cancel"
              title="Cancel"
              show="always"
              accessibilityRole="link"
              href={stateNavigator.historyManager.getHref(
                stateNavigator.getNavigationBackLink(1)
              )}
              onPress={() => stateNavigator.navigateBack(1)} />
          </RightBar>
        </NavigationBar>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <SharedElement name={color} data={{color}} style={styles.color}>
            <View style={{backgroundColor: color, flex: 1}} />
          </SharedElement>
          <Text style={styles.text}>{color}</Text>
          <View style={styles.colors}>
            {[1,2,3].map(i => colors[(colors.indexOf(color) + i) % 15])
              .map(subcolor => (
                <TouchableHighlight
                  key={subcolor}
                  style={[styles.subcolor, {backgroundColor: subcolor}]}
                  underlayColor={subcolor}
                  accessibilityRole="link"
                  href={stateNavigator.historyManager.getHref(
                    stateNavigator.getRefreshLink({color: subcolor})
                  )}
                  onPress={(e) => {
                    if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey || e.button) return
                    e.preventDefault()
                    stateNavigator.refresh({color: subcolor}, 'replace');
                  }}>
                    <View />
                </TouchableHighlight>
              )
            )}
          </View>
        </ScrollView>
      </>
  );
}
  
const styles = StyleSheet.create({
  back: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    paddingLeft: 20,
    paddingTop: 10,
  },
  color: {
    height: 300,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  text:{
    fontSize: 80,
    color: '#000',
    textAlign:'center',
    fontWeight: 'bold',
  },
  colors: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  subcolor: {
    width: 100,
    height: 50,
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 10,
  },
});