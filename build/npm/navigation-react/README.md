# Hello World
```jsx
import { StateNavigator } from 'navigation';
import { NavigationHandler, NavigationLink, NavigationContext, SceneView } from 'navigation-react';

const stateNavigator = new StateNavigator([
  { key: 'hello', route: '' },
  { key: 'world' }
]);

stateNavigator.start();

const Hello = () => (
  <NavigationLink
    stateKey="world"
    navigationData={{ size: 20 }}>
    Hello
  </NavigationLink>
);

const World = () => {
  const { data } = useContext(NavigationContext);
  return (
    <div style={{ fontSize: data.size }}>World</div>
  );
};

const App = () => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <SceneView active="hello"><Hello /></SceneView>
    <SceneView active="world"><World /></SceneView>
  </NavigationHandler>  
);
```
