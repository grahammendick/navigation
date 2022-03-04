import React, {useEffect, useRef, useState} from 'react';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import { NavigationStack } from 'navigation-react-native';

const Stack = ({ children, ...props }) => {
  const stateNavigatorRef = useRef(new StateNavigator([]))
  const stateNavigator = stateNavigatorRef.current;
  const [states, setStates] = useState([]);
  useEffect(() => {
    const validateNavigation = ({ __deleted }, _data, _url, _history, { state }) => (
      !__deleted && stateNavigator.states[state.key] === state
    );
    const { newStates, newStatesLookup } = React.Children.toArray(children)
      .reduce(({ newStates, newStatesLookup }, { props: { name, ...rest }}) => {
        newStates.push({ key: name, ...rest })
        newStatesLookup[name] = true;
        return { newStates, newStatesLookup };
      }, { newStates: [], newStatesLookup: {} })
    if (newStates.length) {
      for(const oldState of states) {
        if (!newStatesLookup[oldState.key])
          newStates.push({ ...oldState, __deleted: true });
      }
      const { state, url } = stateNavigator.stateContext;
      stateNavigator.configure(newStates);
      let changed = !state;
      if (!changed) {
        const { state, crumbs } = stateNavigator.parseLink(url);
        changed = state.__deleted || crumbs.filter(({ state }) => state.__deleted).length;
      }
      if (changed)
        stateNavigator.navigate(newStates[0].key);
      stateNavigator.onBeforeNavigate(validateNavigation);
      setStates(newStates);
    }
    return () => stateNavigator.offBeforeNavigate(validateNavigation);
  }, [ children ]);
  return (
    <NavigationHandler stateNavigator={stateNavigator}>
      <NavigationStack {...props} />
    </NavigationHandler>
  )
}

Stack.Scene = () => null;

export default Stack;
