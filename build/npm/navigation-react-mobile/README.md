# Hello World

```js
var Navigation = require('navigation');
var NavigationReact = require('navigation-react');
var NavigationReactMobile = require('navigation-react-mobile');

var stateNavigator = new Navigation.StateNavigator([
  {key: 'hello', route: ''},
  {key: 'world', trackCrumbTrail: true}
]);

stateNavigator.states.hello.renderScene = function() {
  return (
    <NavigationReact.NavigationLink stateKey="world">
      Hello
    </NavigationReact.NavigationLink>
  );
};

stateNavigator.states.world.renderScene = function() {
  return (
    <NavigationReact.NavigationBackLink distance={1}>
      World
    </NavigationReact.NavigationBackLink>
  );
};

stateNavigator.start();

ReactDOM.render(
  <NavigationReact.NavigationHandler stateNavigator={stateNavigator}>
    <NavigationReactMobile.NavigationMotion
      unmountedStyle={{translate: 100}}
      mountedStyle={{translate: 0}}
      crumbStyle={{translate: -10}}>
      {(style, scene, key) => (
        <div
          key={key}
          style={{transform: `translate(${style.translate}%)`}}>
          {scene}
        </div>
      )}
    </NavigationReactMobile.NavigationMotion>
  </NavigationReact.NavigationHandler>,
  document.getElementById('app')
);
```
