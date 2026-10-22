import { createContext, RefObject } from 'react';

export default createContext<{sceneViewKey: string, refetcher: (scene?: boolean | string) => void, registerSceneView: (sceneViewKey: string, active: string | string[]) => void, deserialize: (url: string, actionId?: string, args?: any[]) => Promise<any>, trigger: (navigationEvent: any) => void, keys?: RefObject<{data: string[], state: boolean}>}>({sceneViewKey: null, refetcher: null, registerSceneView: null, deserialize: null, trigger: null});
