import { createContext } from 'react';

export default createContext<{deserialize: (url: string, options: any, actionId?: string, args?: any[]) => Promise<any>, createFromFetch: (promiseForResponse: Promise<Response>, options?: object) => Promise<any>,  onHmrReload: (hmrReload: () => void) => () => void}>({deserialize: () => null, createFromFetch: () => null, onHmrReload: () => () => {}});
