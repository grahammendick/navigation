import { createContext } from 'react';
import { StateContext } from 'navigation';

export default createContext<{setRefetch: (refetch?: string[] | ((stateContext: StateContext) => boolean)) => void, refetcher: (scene?: boolean) => void}>({setRefetch: null, refetcher: null});
