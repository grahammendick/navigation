# Hello World

```js
var Navigation = require('navigation');
var NavigationReact = require('navigation-react');

var stateNavigator = new Navigation.StateNavigator([
  {key: 'hello', route: ''},
  {key: 'world'}
]);

stateNavigator.states.hello.renderView = function() {
  return (
    <NavigationReact.NavigationLink 
      stateKey="world"
      navigationData={{size: 20}}>
      Hello
    </NavigationReact.NavigationLink>
  );
};

stateNavigator.states.world.renderView = function(data) {
  return (
    <div style={{fontSize: data.size}}>World</div>
  );
};

stateNavigator.start();

ReactDOM.render(
  <NavigationReact.NavigationHandler stateNavigator={stateNavigator}>
    <NavigationReact.NavigationContext.Consumer>
      {({ state, data }) => state.renderView(data)}
    </NavigationReact.NavigationContext.Consumer>
  </NavigationReact.NavigationHandler>,
  document.getElementById('app')
);
```
