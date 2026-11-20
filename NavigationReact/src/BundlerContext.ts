import { createContext } from 'react';

export default createContext<{fetchRSC: (url: string, options: {body: any, headers?: Record<string, string>, signal?: AbortSignal}) => Promise<any>, onHmrReload: (hmrReload: () => void) => () => void}>({fetchRSC: null, onHmrReload: null});
