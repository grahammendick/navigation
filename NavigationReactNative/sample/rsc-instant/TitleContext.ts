import { createContext } from 'react';

export default createContext<(title: string) => void>(() => {});
