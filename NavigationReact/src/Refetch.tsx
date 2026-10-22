'use client'
import { use, useContext, useLayoutEffect } from 'react';
import RefetchContext from './RefetchContext.js';

const Refetch = ({keys: keysPromise, children}: {keys: Promise<{data: string[], state: boolean}>, children: any}) => {
    const keys = use(keysPromise);
    const refetchKeys = useContext(RefetchContext).keys;
    useLayoutEffect(() => {
        refetchKeys.current = keys;
    }, [keys, refetchKeys]);
    return children;
};
export default Refetch;
