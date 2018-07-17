# Hello World

```js
import {StateNavigator} from 'navigation';
import {NavigationHandler} from 'navigation-react';
import {addNavigateHandlers, Scene} from 'navigation-react-native';

var stateNavigator = new StateNavigator([
  {key: 'hello', title: 'Hello'},
  {key: 'world', title: 'World', trackCrumbTrail: true},
]);

const {hello, world} = stateNavigator.states;

hello.renderScene = () => (
  <TouchableHighlight
    onPress={() => {
      stateNavigator.navigate('world', {size: 20});
    }}>
    <Text>Hello</Text>
  </TouchableHighlight>
);

world.renderScene = ({size}) => (
  <Text style={{fontSize: size}}>World</Text>
);

stateNavigator.navigate('hello');
addNavigateHandlers(stateNavigator);

export default ({crumb}) => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <Scene crumb={crumb} />
  </NavigationHandler>
);
```
