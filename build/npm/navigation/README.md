# Hello World

```js
var Navigation = require('navigation');

var stateNavigator = new Navigation.StateNavigator([
  {key: 'hello', route: ''},
  {key: 'world'}
]);

stateNavigator.states.hello.navigated = function(data) {
    stateNavigator.navigate('world', {size: 20});
};

stateNavigator.states.world.navigated = function(data) {
    console.log(data.size);
};

stateNavigator.start();
```
