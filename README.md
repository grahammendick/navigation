# [Navigation](http://grahammendick.github.io/navigation/)
Navigation is the only data-first JavaScript router. [Try it out.](http://grahammendick.github.io/navigation/)
* **Data First** Other JavaScript routers have got it all back to front. They want you to configure your routes before you even know what data you're passing. With the Navigation router, you can delay your route configuration until after your application's up and running.
* **Routes Last** How can your application run if you haven't set any routes? The Navigation router generates interim routes and passes all data in the query string. At any time, you can configure the real routes and introduce route parameters without changing any code.

## Build
Once you've cloned the repository, you can install the dependencies and run the build:

    npm install
    npm run build

Running `npm test` executes the unit tests.

Thanks to [BrowserStack](https://www.browserstack.com/) for their help with cross browser testing

## Code
You'll find the Navigation router source code in the Navigation folder. It's written in TypeScript and is built on top of node.js. The NavigationReact folder contains the source code for the Hyperlink components.

## Example
Here's the [Hello World example](http://grahammendick.github.io/navigation/documentation/hello-world.html) from the documentation.

```js
var stateNavigator = new Navigation.StateNavigator([
  {key: 'hello', route: ''},
  {key: 'world', route: '{size}', defaultTypes: {size: 'number'}}
]);

stateNavigator.states.hello.navigated = function() {
  ReactDOM.render(
    <NavigationReact.NavigationLink 
      stateKey="world"
      navigationData={{size: 20}}
      stateNavigator={stateNavigator}>
      Hello
    </NavigationReact.NavigationLink>,
    document.getElementById('app'));
};

stateNavigator.states.world.navigated = function(data) {
  ReactDOM.render(
    <div style={{fontSize: data.size}}>World</div>,
    document.getElementById('app'));
};

stateNavigator.start();
```



