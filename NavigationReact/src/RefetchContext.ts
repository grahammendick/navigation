import { createContext } from 'react';

export default createContext<{refetcher: (scene?: boolean | string) => void, registerSceneView: (sceneViewKey: string, active: string | string[]) => void, deserialize: (url: string, actionId?: string, args?: any[]) => Promise<any>, trigger: (navigationEvent: any) => void, getCache?: (sceneViewKey: string, navigationData: any) => any, setCache?: (sceneViewKey: string, navigationData: any, sceneView: any, ancestors: string[]) => void}>({refetcher: null, registerSceneView: null, deserialize: null, trigger: null});
