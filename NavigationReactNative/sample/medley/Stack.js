import React from 'react';
import { NavigationStack, Scene } from 'navigation-react-native';

const Stack = ({Direction, closeSheet}) => (
  <NavigationStack>
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

export default Stack;
