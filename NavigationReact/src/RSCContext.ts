import { createContext } from 'react';
import { StateContext } from 'navigation';

export default createContext<{fetching: boolean, setRefetch: (refetch?: string[] | ((stateContext: StateContext) => boolean)) => void, refetcher: (scene?: boolean) => void}>({fetching: false, setRefetch: null, refetcher: null});
