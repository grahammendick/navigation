import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import { NavigationStack } from 'navigation-react-native';

const Stack = ({ children, ...props }) => {
  const stateNavigatorRef = useRef(new StateNavigator([]))
  const stateNavigator = stateNavigatorRef.current;
  const [states, setStates] = useState([]);
  useEffect(() => {
    /**
     * Builds the new states from the children. Keeps the old states
     * but marks them as deleted (they're needed to parse old urls)
     */
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
    /**
     * If the current stack contains any deleted scenes then navigates
     * to the first scene in the new stack. Adds a handler that prevents
     * attempted navigation to scenes in the old stack
     */
    const { state, url } = stateNavigator.stateContext;
    stateNavigator.configure(states);
    let changed = !state;
    if (!changed) {
      const { state: { __deleted }, crumbs } = stateNavigator.parseLink(url);
      changed = __deleted || crumbs.some(({ state: { __deleted } }) => __deleted);
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
