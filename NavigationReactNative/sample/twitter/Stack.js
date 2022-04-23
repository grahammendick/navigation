import React, {useContext, useMemo, useState, useEffect} from 'react';
import { StateNavigator } from 'navigation';
import { NavigationContext } from 'navigation-react';
import { NavigationStack } from 'navigation-react-native';

const Stack = ({children, ...props}) => {
  const {stateNavigator, state} = useContext(NavigationContext);
  const scenes = useMemo(() => (
    React.Children.toArray(children)
      .reduce((scenes, scene) => ({...scenes, [scene.props.stateKey]: scene}), {})
  ), [children]);
  const [allScenes, setAllScenes] = useState(scenes);
  useEffect(() => {
    setAllScenes(prevScenes => ({...prevScenes, ...scenes}));
    const {crumbs, nextCrumb} = stateNavigator.stateContext;
    const invalid = [...crumbs, nextCrumb].find(({state}) => !scenes[state.key]);
    if (invalid) {
      const {stateKey} = React.Children.toArray(children)[0].props;
      stateNavigator.navigateLink(stateNavigator.fluent().navigate(stateKey).url);
    }
  }, [children, stateNavigator, scenes]);
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
