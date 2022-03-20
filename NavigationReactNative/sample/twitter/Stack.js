import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import { NavigationStack } from 'navigation-react-native';

const Stack = ({ children, ...props }) => {
  const stateNavigatorRef = useRef(new StateNavigator([]))
  const stateNavigator = stateNavigatorRef.current;
  const [states, setStates] = useState([]);
  useEffect(() => {
    setStates(oldStates => {
      const { newStates, newStatesLookup } = React.Children.toArray(children)
        .reduce(({ newStates, newStatesLookup }, { props: { name, ...rest }}) => {
          newStates.push({ key: name, ...rest })
          newStatesLookup[name] = true;
          return { newStates, newStatesLookup };
        }, { newStates: [], newStatesLookup: {} })
      for(const oldState of oldStates) {
        if (!newStatesLookup[oldState.key])
          newStates.push({ ...oldState, __deleted: true });
      }
      return newStates;
    });
  }, [ children ]);
  useLayoutEffect(() => {
    const { state, url } = stateNavigator.stateContext;
    stateNavigator.configure(states);
    let changed = !state;
    if (!changed) {
      const { state, crumbs } = stateNavigator.parseLink(url);
      changed = state.__deleted || crumbs.filter(({ state }) => state.__deleted).length;
    }
    if (changed && states.length)
      stateNavigator.navigate(states[0].key);
    const validateNavigation = ({ __deleted }) => !__deleted;
    stateNavigator.onBeforeNavigate(validateNavigation);
    return () => stateNavigator.offBeforeNavigate(validateNavigation);
  }, [ states ]);
  return !!states.length && (
    <NavigationHandler stateNavigator={stateNavigator}>
      <NavigationStack {...props} />
    </NavigationHandler>
  )
}

Stack.Scene = () => null;

export default Stack;
