import { createContext, RefObject } from 'react';

export default createContext<{sceneViewKey: string, fetchingFn: (navigationEvent: any) => boolean, keys?: RefObject<{data: string[], state: boolean}>, cache?: 'refresh' | false}>({sceneViewKey: null, fetchingFn: () => false});
