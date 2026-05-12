import { createContext } from 'react';

export default createContext<{sceneViewKey: string, refetcher: (scene?: boolean | string) => void, registerSceneView: (sceneViewKey: string, active: string | string[]) => void, deserialize: (url: string, options: any, actionId?: string, args?: any[]) => Promise<any>}>({sceneViewKey: null, refetcher: null, registerSceneView: null, deserialize: null});
