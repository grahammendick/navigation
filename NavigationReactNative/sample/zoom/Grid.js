import React, {useContext, useState} from 'react';
import {Platform, StyleSheet, ScrollView, View, TouchableHighlight} from 'react-native';
import {NavigationContext} from 'navigation-react';
import {SharedElement, NavigationBar, SearchBar, RightBar, BarButton} from 'navigation-react-native';

const Colors = ({colors, children, filter}) => {
  const {stateNavigator} = useContext(NavigationContext);
  const suffix = filter != null ? '_search' : '';
  const matchedColors = colors.filter(color => (
    !filter || color.indexOf(filter.toLowerCase()) !== -1
  ));
  return (
    <ScrollView
      style={styles.scene}
      contentInsetAdjustmentBehavior="automatic">
      <View style={styles.colors}>
        {matchedColors.map(color => (
          <TouchableHighlight
            key={color}
            style={styles.color}
            underlayColor={color}                
            onPress={() => {
              stateNavigator.navigate('detail', {
                color, name: color + suffix, filter, search: filter != null
              });
            }}>
            <SharedElement name={color + suffix} style={{flex: 1}} duration={250}>
              <View style={{backgroundColor: color, flex: 1}} />
            </SharedElement>
          </TouchableHighlight>
        ))}
        {children}
      </View>
    </ScrollView>
  );
}

const Container = (props) => (
  Platform.OS === 'ios' ? <ScrollView {...props}/> : <View {...props} />
);

const Grid = ({colors}) => {
  const [text, setText] = useState('');
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
          <Colors colors={colors} filter={text} />
        </SearchBar>
        <RightBar>
          <BarButton title="search" show="always" search={true} />
        </RightBar>
      </NavigationBar>
      <Colors colors={colors} />
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
});