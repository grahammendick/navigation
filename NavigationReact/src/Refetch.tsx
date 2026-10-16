'use client'
import { useContext, useLayoutEffect } from 'react';
import RefetchContext from './RefetchContext.js';

const Refetch = ({keys, children}: {keys: string[], children: any}) => {
    const refetchKeys = useContext(RefetchContext).keys;
    useLayoutEffect(() => {
        refetchKeys.current = keys;
    });
    return children;
};
export default Refetch;
