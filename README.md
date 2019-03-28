# [Navigation](http://grahammendick.github.io/navigation/)
Navigation is the data-first JavaScript router. [Try it out.](http://grahammendick.github.io/navigation/)
* **Data First** Other JavaScript routers have got it all back to front. They want you to configure your routes before you even know what data you're passing. With the Navigation router, you can delay your route configuration until after your application's up and running.
* **Routes Last** How can your application run if you haven't set any routes? The Navigation router generates interim routes and passes all data in the query string. At any time, you can configure the real routes and introduce route parameters without changing any code.

## Build
Once you've cloned the repository, you can install the dependencies and run the build:

    npm install
    npm run build

Running `npm test` executes the unit tests.  
Running `npm run package` outputs the npm packages inside the `build/npm` folder.

Thanks to [BrowserStack](https://www.browserstack.com/) for their help with cross browser testing

## Code
You'll find the Navigation router source code in the Navigation folder. It's written in TypeScript and is built on top of node.js. The NavigationReact folder contains the source code for the Hyperlink components.

## Download
The Navigation router is made up of three npm packages: `navigation`, for the core router, `navigation-react`, for the Hyperlink components, and `navigation-react-mobile`, for native-like navigation.
```
var Navigation = require('navigation');
var NavigationReact = require('navigation-react');
var NavigationReactMobile = require('navigation-react-mobile');
```

## Example
Here's the [Hello World example](http://grahammendick.github.io/navigation/documentation/hello-world.html) from the documentation. The example has two views. One view displays a Hyperlink that says 'Hello'. Clicking this Hyperlink navigates to the second view displaying the text 'World' inside a div. The Hyperlink passes across a number that sets the div's font-size.

```js
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
  return <div style={{fontSize: data.size}}>World</div>;
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



