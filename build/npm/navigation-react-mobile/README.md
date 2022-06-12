# Hello World

```jsx
import { StateNavigator } from 'navigation';
import { NavigationHandler, NavigationLink, NavigationBackLink } from 'navigation-react';
import { NavigationMotion, Scene } from 'navigation-react-mobile';

const stateNavigator = new Navigation.StateNavigator([
  { key: 'hello', route: '' },
  { key: 'world', trackCrumbTrail: true }
]);

stateNavigator.start();

const Hello = () => (
  <NavigationLink stateKey="world">
    Hello
  </NavigationLink>
);

const World = () => (
  <NavigationBackLink distance={1}>
    World
  </NavigationBackLink>
);

const App = () => (
  <NavigationHandler stateNavigator={stateNavigator}>
    <NavigationMotion
      unmountedStyle={{ translate: 100 }}
      mountedStyle={{ translate: 0 }}
      crumbStyle={{ translate: -10 }}
      renderMotion={(style, scene, key) => (
        <div
          key={key}
          style={{ transform: `translate(${style.translate}%)` }}>
          {scene}
        </div>
      )}>
      <Scene stateKey="hello"><Hello /></Scene>
      <Scene stateKey="world"><World /></Scene>
    </NavigationMotion>
  </NavigationHandler>
);
```