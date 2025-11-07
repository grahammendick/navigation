import { createContext } from 'react';

export default createContext<{setRoot: () => void, deserialize: (url: string, options: any) => Promise<any>}>({setRoot: () => {}, deserialize: (url: string, options: any) => null});
