import { createContext, RefObject } from 'react';

export default createContext<{ancestors: string[], fetchingFn: (navigationEvent: any) => boolean, keys?: RefObject<{data: string[], state: boolean}>, cache?: boolean}>({ancestors: [], fetchingFn: () => false});
