import { createContext } from 'react';

export default createContext<{deserialize: (url: string, options: any) => Promise<any>, onHmrReload: (hmrReload: () => void) => () => void}>({deserialize: () => null, onHmrReload: () => () => {}});
