import React, {useContext, useState} from 'react';
import {Platform, StyleSheet, ScrollView, View, TouchableHighlight, Text} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {SharedElement, NavigationBar, SearchBar, RightBar, BarButton} from 'navigation-react-native';

const Container = (props) => (
  Platform.OS === 'ios' ? <ScrollView {...props}/> : <View {...props} />
);

const SearchResults = ({colors, text}) => {
  const {stateNavigator} = useContext(NavigationContext);
  return (
    <ScrollView
      style={styles.scene}
      contentInsetAdjustmentBehavior="automatic">
      <View>
        {colors
          .filter(color => (
            !text || color.indexOf(text.toLowerCase()) !== -1
          ))
          .map(color => (
            <TouchableHighlight
              key={color}
              style={styles.result}
              underlayColor="white"
              onPress={() => {
                stateNavigator.navigate('detail', {color, search: true});
              }}>
                <>
                  <View style={{backgroundColor: color, width: 100, height: 50}} />
                  <Text style={{fontSize: 25, marginLeft: 10}}>{color}</Text>
                </>
            </TouchableHighlight>
          ))}
      </View>
    </ScrollView>
  )
}

const Grid = ({colors}) => {
  const [text, setText] = useState('');
  const {stateNavigator} = useContext(NavigationContext);
  return (
    <Container
      style={styles.scene}
      collapsable={false}
      contentInsetAdjustmentBehavior="automatic">
      <NavigationBar
        largeTitle={true}
        title="Colors"
        barTintColor={Platform.OS === 'android' ? '#fff' : null}>
        <SearchBar
          text={text}
          autoCapitalize="none"
          obscureBackground={false}
          onChangeText={text => setText(text)}>
          <SearchResults colors={colors} text={text} />
        </SearchBar>
        <RightBar>
          <BarButton title="search" show="always" search={true} />
        </RightBar>
      </NavigationBar>
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
              <SharedElement name={color} style={{flex: 1}} duration={250}>
                <View style={{backgroundColor: color, flex: 1}} />
              </SharedElement>
            </TouchableHighlight>
          ))}
        </View>
      </ScrollView>
    </Container>
  );
};

export default Grid;

const styles = StyleSheet.create({
  scene: {
    backgroundColor: '#fff',
    flex: 1,
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
  result: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center'    
  }
});
