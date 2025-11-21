import { createContext } from 'react';
import { StateContext } from 'navigation';

export default createContext<{setRefetch: (refetch?: string[] | ((stateContext: StateContext) => boolean)) => void, refetcher: (scene?: boolean | string) => void, registerRootView: (sceneViewKey: string, active: string | string[]) => void}>({setRefetch: null, refetcher: null, registerRootView: null});
