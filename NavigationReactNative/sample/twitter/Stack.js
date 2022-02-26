import React, {useEffect, useRef, useState} from 'react';
import { StateNavigator } from 'navigation';
import { NavigationHandler } from 'navigation-react';
import { NavigationStack } from 'navigation-react-native';

const Stack = ({ children, ...props }) => {
  const stateNavigator = useRef(null)
  const [, forceUpdate] = useState({});
  useEffect(() => {
    const states = React.Children.toArray(children)
      .map(({ props: { name, ...rest }}) => ({ key: name, ...rest }));
      if (states.length) {
        stateNavigator.current = stateNavigator.current || new StateNavigator();
        stateNavigator.current.configure(states);
        const { url } = stateNavigator.current.stateContext;
        try {
          stateNavigator.current.parseLink(url);
        } catch(e) {
          stateNavigator.current.navigate(states[0].key);
          forceUpdate({});
        }
      }
  })
  return stateNavigator.current && (
    <NavigationHandler stateNavigator={stateNavigator.current}>
      <NavigationStack {...props} />
    </NavigationHandler>
  )
}

Stack.Scene = () => null;

export default Stack;
