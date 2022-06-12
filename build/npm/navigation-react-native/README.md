# Hello World

```jsx
import { StateNavigator } from 'navigation';
import { NavigationHandler, NavigationContext } from 'navigation-react';
import { NavigationStack,. Scene } from 'navigation-react-native';

const stateNavigator = new StateNavigator([
  { key: 'hello' },
  { key: 'world', trackCrumbTrail: true },
]);

const Hello = () => {
  const { stateNavigator } = useContext(NavigationContext);
  return (
    <Button
      title="Hello"
      onPress={() => {
        stateNavigator.navigate('world', { size: 20 });
      }} />
  );
};

const World = () => {
  const { data } = useContext(NavigationContext);
  return <Text style={{ fontSize: data.size }}>World</Text>;
};

const App = () => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <NavigationStack>
      <Scene stateKey="hello"><Hello /></Scene>
      <Scene stateKey="world"><World /></Scene>
    </NavigationStack>
  </NavigationHandler>
);
```