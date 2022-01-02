# Hello World

```jsx
import { StateNavigator } from 'navigation';
import { NavigationHandler, NavigationContext } from 'navigation-react';
import { NavigationStack } from 'navigation-react-native';

const stateNavigator = new StateNavigator([
  { key: 'hello', route: '' },
  { key: 'world', trackCrumbTrail: true },
]);

const Hello = () => {
  const { stateNavigator } = useContext(NavigationContext);
  return (
    <TouchableHighlight
      href={stateNavigator.historyManager.getHref(
        stateNavigator.navigate('world', { size: 20 })
      )}
      onPress={(e) => {
        e.preventDefault();
        stateNavigator.navigate('world', { size: 20 });
      }}>
      <Text>Hello</Text>
    </TouchableHighlight>
  );
};

const World = () => {
  const { data } = useContext(NavigationContext);
  return <Text style={{ fontSize: data.size }}>World</Text>;
};

const { hello, world } = stateNavigator.states;

hello.renderScene = () => <Hello />;
world.renderScene = () => <World />;

stateNavigator.start();

const App = () => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <NavigationStack />
  </NavigationHandler>
);

export default App;
```