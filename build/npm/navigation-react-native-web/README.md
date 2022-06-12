# Hello World

```jsx
import { StateNavigator } from 'navigation';
import { NavigationHandler, NavigationContext } from 'navigation-react';
import { NavigationStack, Scene } from 'navigation-react-native';

const stateNavigator = new StateNavigator([
  { key: 'hello', route: '' },
  { key: 'world', trackCrumbTrail: true },
]);

if (Platform.OS === 'web') stateNavigator.start();

const Hello = () => {
  const { stateNavigator } = useContext(NavigationContext);
  return (
    <Button
      title="Hello"
      href={stateNavigator.historyManager.getHref(
        stateNavigator.navigate('world', { size: 20 })
      )}
      onPress={(e) => {
        e.preventDefault();
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