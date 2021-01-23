# Hello World

```js
import { StateNavigator } from 'navigation';
import { NavigationHandler, NavigationContext } from 'navigation-react';
import { NavigationStack } from 'navigation-react-native';

const stateNavigator = new StateNavigator([
  { key: 'hello' },
  { key: 'world', trackCrumbTrail: true },
]);

const Hello = () => {
  const { stateNavigator } = useContext(NavigationContext);
  return (
    <TouchableHighlight
      onPress={() => {
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

stateNavigator.navigate('hello');

const App = () => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <NavigationStack />
  </NavigationHandler>
);

export default App;
```