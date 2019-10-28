import React from 'react';
import {Platform, StyleSheet, ScrollView, Text, View, TouchableHighlight} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {NavigationBar, RightBar, BarButton, TitleBar, SharedElementAndroid} from 'navigation-react-native';

export default ({colors, color}) => (
  <NavigationContext.Consumer>
    {({stateNavigator}) => (
      <>
        <NavigationBar
          title="Color"
          barTintColor={Platform.OS === 'android' ? '#fff' : null}>
          <TitleBar style={styles.titleBar}>
            <Text style={styles.titleBarText}>Color</Text>
            <View style={{backgroundColor: color, width: 28, height: 28}}/>
          </TitleBar>
          <RightBar>
            <BarButton title="X" show="always" systemItem="cancel" onPress={() => {
              stateNavigator.navigateBack(1);
            }} />
          </RightBar>
        </NavigationBar>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <SharedElementAndroid
            name={color}
            style={styles.color}
            transition="overshoot">
            <View style={{backgroundColor: color, flex: 1}} />
          </SharedElementAndroid>
          <Text style={styles.text}>{color}</Text>
          <View style={styles.colors}>
            {[1,2,3].map(i => colors[(colors.indexOf(color) + i) % 15])
              .map(subcolor => (
                <TouchableHighlight
                  key={subcolor}
                  style={[styles.subcolor, {backgroundColor: subcolor}]}
                  underlayColor={subcolor}
                  onPress={() => {
                    stateNavigator.navigate('detail', {color: subcolor});
                  }}>
                    <View />
                </TouchableHighlight>
              )
            )}
          </View>
        </ScrollView>
      </>
    )}
  </NavigationContext.Consumer>
);
  
const styles = StyleSheet.create({
  titleBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleBarText: {
    marginRight: 4,
    fontSize: Platform.OS === 'ios' ? 16 : 20,
  },
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
