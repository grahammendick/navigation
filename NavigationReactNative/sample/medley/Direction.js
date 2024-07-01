import React, {useState, useContext, useMemo} from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import {StateNavigator} from 'navigation';
import {NavigationContext, NavigationHandler} from 'navigation-react';
import {NavigationStack, Scene, NavigationBar, ModalBackHandler, BarButton, RightBar, Sheet} from 'navigation-react-native';

const nextDirection = {
  north: 'east',
  east: 'south',
  south: 'west',
  west: 'north',
};

const Stack = ({closeSheet, underlayColor = '#000'}) => (
  <NavigationStack underlayColor={() => underlayColor}>
    <Scene stateKey="north"
      crumbStyle={{ type: 'translate', startY: '-30%' }}
      unmountStyle={{ type: 'translate', startY: '-100%' }}>
      <Direction direction="north" color="blue" closeSheet={closeSheet} />
    </Scene>
    <Scene stateKey="east"
      crumbStyle={{ type: 'translate', startX: '30%' }}
      unmountStyle={{ type: 'translate', startX: '100%' }}>
      <Direction direction="east" color="red" closeSheet={closeSheet} />
    </Scene>
    <Scene stateKey="south"
      crumbStyle={{ type: 'translate', startY: '30%' }}
      unmountStyle={{ type: 'translate', startY: '100%' }}>
      <Direction direction="south" color="green" closeSheet={closeSheet} />
    </Scene>
    <Scene stateKey="west"
      crumbStyle={{ type: 'translate', startX: '-30%' }}
      unmountStyle={{ type: 'translate', startX: '-100%' }}>
      <Direction direction="west" color="black" closeSheet={closeSheet} />
    </Scene>
  </NavigationStack>
);

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
                <Stack closeSheet={() => setDetent('hidden')} underlayColor='transparent' />
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

export {Stack};
export default Direction;
