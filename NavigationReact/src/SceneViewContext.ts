import { createContext } from 'react';
import { Refetch } from './Props.js';

export default createContext<{setRefetch: (refetch: Refetch) => void}>({setRefetch: null});
