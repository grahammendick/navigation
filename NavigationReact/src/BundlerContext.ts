import { createContext } from 'react';

export default createContext<{createFromFetch: (promiseForResponse: Promise<Response>, options?: object) => Promise<any>, createTemporaryReferenceSet: () => any, encodeReply: (v: any, options?: any) => Promise<string | FormData>, onHmrReload: (hmrReload: () => void) => () => void, fetchRSC?: (payload: any) => Promise<any>}>({createFromFetch: null, createTemporaryReferenceSet: null, encodeReply: null, onHmrReload: null, fetchRSC: null});
