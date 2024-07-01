import React, {useState, useContext, useMemo} from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import {StateNavigator} from 'navigation';
import {NavigationContext, NavigationHandler} from 'navigation-react';
import {NavigationStack, NavigationBar, ModalBackHandler, BarButton, RightBar, Sheet} from 'navigation-react-native';
import Stack from './Stack';

const nextDirection = {
  north: 'east',
  east: 'south',
  south: 'west',
  west: 'north',
};

const Direction = ({direction, color, closeSheet}) => {
  const [detent, setDetent] = useState('hidden');
  const {stateNavigator: {stateContext: {crumbs}}, stateNavigator} = useContext(NavigationContext);
  const modalNavigator = useMemo(() => new StateNavigator(stateNavigator), []);
  return (
      <>
        <NavigationBar
          title={direction[0].toUpperCase() + direction.slice(1)}
          barTintColor="white">
            <RightBar>
              <BarButton
                show="always"
                title={!closeSheet ? "Open" : "Close"}
                onPress={() => {
                  if (!closeSheet)
                    setDetent('expanded')
                  else
                    closeSheet();
                }} />
            </RightBar>
        </NavigationBar>
        <View style={[
          styles.scene,
          {backgroundColor: color}
        ]}>
          <TouchableHighlight
            underlayColor={color}
            onPress={() => {
              stateNavigator.navigate(nextDirection[direction]);
          }}>
            <Text style={styles.text}>{direction} {crumbs.length}</Text>
          </TouchableHighlight>
          {stateNavigator.canNavigateBack(1) && <TouchableHighlight
            underlayColor={color}
            onPress={() => {
              stateNavigator.navigateBack(1);
          }}>
            <Text style={styles.text}>back</Text>
          </TouchableHighlight>}
          <Sheet detent={detent} onChangeDetent={setDetent} hideable skipCollapsed expandedOffset={100}>
              <NavigationHandler stateNavigator={modalNavigator}>
                <Stack Direction={Direction} closeSheet={() => setDetent('hidden')} />
              </NavigationHandler>
          </Sheet>
        </View>
      </>
  );
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

export default Direction;
