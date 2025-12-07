import { createContext } from 'react';
import { StateContext } from 'navigation';

export default createContext<{setRefetch: (refetch?: string[] | ((stateContext: StateContext) => boolean)) => void, refetcher: (scene?: boolean | string) => void, registerSceneView: (sceneViewKey: string, active: string | string[]) => void}>({setRefetch: null, refetcher: null, registerSceneView: null});
