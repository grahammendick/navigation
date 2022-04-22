import React, {useContext, useMemo} from 'react';
import { StateNavigator } from 'navigation';
import { NavigationContext } from 'navigation-react';
import { NavigationStack } from 'navigation-react-native';

const Stack = ({ children, ...props }) => {
  const { stateNavigator } = useContext(NavigationContext);
  const { scenes, firstScene } = useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    return childrenArray
      .reduce(({ scenes, firstScene }, { props: { name, component } }) => {
        scenes[name] = component;
        firstScene = firstScene || component;
        return { scenes, firstScene };
      }, { scenes: {}, firstScene: null });
  }, [children]);
  return (
      <NavigationStack
        renderScene={(state, data) => scenes[state.key] || firstScene}
        {...props} />
  )
}

Stack.Scene = () => null;

export default Stack;
