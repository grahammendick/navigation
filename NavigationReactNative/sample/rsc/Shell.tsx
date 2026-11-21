'use client';
import { BundlerContext, NavigationHandler } from 'navigation-react';
import stateNavigator from './stateNavigator';
import { renderSceneViews } from './server';

const bundler = {
  fetchRSC: (url: string, {body}: {body: any}) => renderSceneViews(body),
  onHmrReload: (hmrReload: () => void) => {
    const listeners = ((globalThis as any).__EXPO_RSC_RELOAD_LISTENERS__ ||= []);
    listeners.push(hmrReload);
    return () => listeners.splice(listeners.indexOf(hmrReload), 1);
  },
};

const Shell = ({url, children}: {url: string, children: any}) => (
  <BundlerContext.Provider value={bundler as any}>
    <NavigationHandler {...{stateNavigator, url} as any}>
      {children}
    </NavigationHandler>
  </BundlerContext.Provider>
);

export default Shell;
