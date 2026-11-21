'use client';
import { useMemo } from 'react';
import { createFromFetch, createTemporaryReferenceSet, encodeReply } from 'react-server-dom-parcel/client';
import { BundlerContext, NavigationHandler, createFetchRSC } from 'navigation-react';
import createStateNavigator from './stateNavigator';

export const fetchRSC = createFetchRSC({createFromFetch, createTemporaryReferenceSet, encodeReply});

const bundler = {
  fetchRSC,
  onHmrReload: (hmrReload: () => void) => {
    const onHmrReload = (e: any) => {
      e.preventDefault();
      hmrReload();
    };
    window.addEventListener('parcelhmrreload', onHmrReload);
    return () => window.removeEventListener('parcelhmrreload', onHmrReload);
  },
};

const Shell = ({url, children}: {url: string, children: any}) => {
  const stateNavigator = useMemo(() => createStateNavigator(), [createStateNavigator]);
  return (
    <BundlerContext.Provider value={bundler}>
      <NavigationHandler {...{stateNavigator, url} as any}>
        {children}
      </NavigationHandler>
    </BundlerContext.Provider>
  );
};

export default Shell;
