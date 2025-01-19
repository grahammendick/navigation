import { StateNavigator } from 'navigation';
import NavigationContext from './NavigationContext.server';

const NavigationHandler = ({ stateNavigator, children }: { stateNavigator: StateNavigator, children: any }) => {
    const { oldState, state, data, asyncData } = stateNavigator.stateContext;
    const navigationEvent = { oldState, state, data, asyncData, stateNavigator: navigator };
      return (
        <NavigationContext.Provider value={navigationEvent}>
            {children}
        </NavigationContext.Provider>
    );
};
export default NavigationHandler;
