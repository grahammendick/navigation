import { createContext } from 'react';

export default createContext<{fetchRSC: (url: string, options: object, actionId?: string, args?: any[]) => Promise<any>, createFromFetch: (resp: Promise<Response>, options?: object) => Promise<any>,  onHmrReload: (hmrReload: () => void) => () => void}>({fetchRSC: () => null, createFromFetch: () => null, onHmrReload: () => () => {}});
