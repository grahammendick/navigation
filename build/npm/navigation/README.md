# The Navigation router
Scene-Based Navigation for React and React Native
* **Scene-Based Navigation** Native apps have always had scene-based navigation. The Navigation router is the first to bring it to the web. You give the Navigation router a list of your scenes. After you navigate to a scene, the Navigation router gets out of your way so you can build your UI however you want.
* **React and React Native** You don't need a different routing library for React and React Native anymore. The Navigation router works on both. What's more, it doesn't compromise the UX. On React Native, the navigation is 100% native on Android and iOS. On React, you can have whatever URLs you want.

## [React](https://grahammendick.github.io/navigation/documentation/hello-world.html)
### Define Your States
```js
import { StateNavigator } from 'navigation';

const stateNavigator = new StateNavigator([
  { key: 'hello', route: '' },
  { key: 'world' }
]);
```
You create one `State` for each scene (page) in your app. You don't need to define your routes yet. The Navigation router generates interim routes. You can define your real routes at any time without changing any code. With scene-based navigation, there aren't any hard-coded Urls for you to update.

### Create Your Scenes
```jsx
<NavigationHandler stateNavigator={stateNavigator}>
  <SceneView active="hello"><Hello /></SceneView>
  <SceneView active="world"><World /></SceneView>
</NavigationHandler>  
```
For each `State`, you create a `SceneView` component that renders the UI. All the other routers for React force you to think in terms of routes. But this is hard becasue routes can be nested, for example, a master/details page. Scenes, on the other hand, are always flat. The Navigation router still supports nested routes because a Scene can have more than one route.

### Navigate to a Scene
```jsx
import { NavigationLink } from 'navigation-react';

const Hello = () => (
  <NavigationLink
    stateKey="world"
    navigationData={{ size: 20 }}>
    Hello
  </NavigationLink>
);
```
The `NavigationLink` component changes scene. You pass the name of the scene and the data. The Navigation router builds the Url. If you've configured more than one route it uses the best match.

### Use the Data
```jsx
import { NavigationContext } from 'navigation-react';

const World = () => {
  const { data } = useContext(NavigationContext);
  return (
    <div style={{ fontSize: data.size }}>
      World
    </div>
  );
};
```
In the next scene, you access the data from the `NavigationContext`. The Navigation router passes strongly-typed data. Here, the size is a number.

## [React Native](https://grahammendick.github.io/navigation/documentation/native/hello-world.html)
### Define Your States
```js
import { StateNavigator } from 'navigation';

const stateNavigator = new StateNavigator([
  { key: 'hello' },
  { key: 'world', trackCrumbTrail: true }
]);
```
You create one `State` for each scene (screen) in your app. You can think of the stack of scenes as a trail of breadcrumbs. Each scene is one crumb. Like Hansel and Gretel in the fairy story, the Navigation router drops a crumb every time it visits a scene (if you set 'trackCrumbTrail' to true).

### Create Your Scenes
```jsx
<NavigationHandler stateNavigator={stateNavigator}>
  <NavigationStack>
    <Scene stateKey="hello"><Hello /></Scene>
    <Scene stateKey="world"><World /></Scene>
  </NavigationStack>
</NavigationHandler>
```
For each `State`, you create a `Scene` component that renders the UI. The Navigation router provides React components to help you build your scenes. All of these components render to the same native primitives as other native apps. For example, the `TabBar` component renders to a `BottomNavigationView` on Android and a `UITabBarController` on iOS.

### Navigate to a Scene
```jsx
import { NavigationContext } from 'navigation-react';

const Hello = () => {
  const { stateNavigator } = useContext(NavigationContext);
  return (
    <Button title="Hello"
      onPress={() => {
        stateNavigator.navigate('world', { size: 20 });
      }} />
  );
};
```
You use the `stateNavigator` from the `NavigationContext` to change scenes. You pass the name of the scene and the data. The navigation is 100% native on Android and iOS.

### Use the Data
```jsx
import { NavigationContext } from 'navigation-react';

const World = () => {
  const { data } = useContext(NavigationContext);
  return (
    <Text style={{ fontSize: data.size }}>
      World
    </Text>
  );
};
```
In the next scene, you access the data from the `NavigationContext`. You can return to the 'hello' scene via the Android back button or swiping/pressing back on iOS.
