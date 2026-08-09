import { createContext, RefObject } from 'react';
import { StateNavigator } from 'navigation';

export default createContext<{instance: RefObject<any>, supportsPrecommitNavigation: boolean, get: (navigationEvent: {stateNavigator: StateNavigator}, sceneViewKey: string) => any, set: (navigationEvent: {stateNavigator: StateNavigator}, sceneViewKey: string, sceneView: any) => void}>({instance: {current:{}}, supportsPrecommitNavigation: false, get: () => {}, set: () => {}});
