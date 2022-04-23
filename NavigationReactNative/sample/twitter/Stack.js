import React, {useContext, useMemo, useState, useEffect} from 'react';
import { StateNavigator } from 'navigation';
import { NavigationContext } from 'navigation-react';
import { NavigationStack } from 'navigation-react-native';

const Stack = ({children, ...props}) => {
  const {stateNavigator, state} = useContext(NavigationContext);
  const {scenes, firstScene} = useMemo(() => (
    React.Children.toArray(children)
      .reduce(({scenes, firstScene}, scene) => (
        {scenes: {...scenes, [scene.props.stateKey]: scene}, firstScene: firstScene || scene}
      ), {scenes: {}, firstScene: null})
  ), [children]);
  const [allScenes, setAllScenes] = useState(scenes);
  useEffect(() => {
    setAllScenes(prevScenes => ({...prevScenes, ...scenes}));
    allScenes.current = {...allScenes.current, ...scenes};
    const {crumbs, nextCrumb} = stateNavigator.stateContext;
    const invalid = [...crumbs, nextCrumb].find(({state}) => !scenes[state.key])
    if (invalid) {
      const url = stateNavigator.fluent().navigate(firstScene).url;
      stateNavigator.navigateLink(url);
    }
  }, [stateNavigator, scenes, firstScene]);
  useEffect(() => {
    const validate = ({key}) => !!scenes[key];
    stateNavigator.onBeforeNavigate(validate);
    return () => stateNavigator.offBeforeNavigate(validate);
  }, [stateNavigator, scenes]);
  return (
      <NavigationStack {...props} renderScene={({key}) => allScenes[key]} />
  )
}

Stack.Scene = ({children}) => children;

export default Stack;
