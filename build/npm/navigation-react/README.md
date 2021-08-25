# Hello World
```jsx
import { StateNavigator } from 'navigation';
import { NavigationHandler, NavigationLink, NavigationContext } from 'navigation-react';

const stateNavigator = new StateNavigator([
  { key: 'hello', route: '' },
  { key: 'world' }
]);

const Hello = () => (
  <NavigationLink
    stateKey="world"
    navigationData={{ size: 20 }}>
    Hello
  </NavigationReact.NavigationLink>
);

const World = () => {
  const { data } = useContext(NavigationContext);
  return (
    <div style={{ fontSize: data.size }}>World</div>
  );
};

const { hello, world } = stateNavigator.states;

hello.renderScene = () => <Hello />;
world.renderScene = () => <World />;

stateNavigator.start();

const App = () => {
  const { state, data } = useContext(NavigationContext);
  return state.renderScene(data);
};

ReactDOM.render(
  <NavigationHandler stateNavigator={stateNavigator}>
    <App />
  </NavigationHandler>,
  document.getElementById('root')
);
```
