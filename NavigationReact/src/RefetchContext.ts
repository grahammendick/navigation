import { createContext } from 'react';

export default createContext<{sceneViewKey: string, refetcher: (scene?: boolean | string) => void, registerSceneView: (sceneViewKey: string, active: string | string[]) => void}>({sceneViewKey: null, refetcher: null, registerSceneView: null});
