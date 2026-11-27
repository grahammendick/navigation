import '@expo/metro-runtime';
import { registerRootComponent } from 'expo';
import { BundlerContext } from 'navigation-react';
import { renderSceneViews } from './server';
import App from './App';

(globalThis as any).__webpack_get_script_filename__ = (id: string) => id;

const bundler = {
  fetchRSC: (url: string, {body}: {body: any}) => renderSceneViews(body),
  onHmrReload: (hmrReload: () => void) => {
    const listeners = ((globalThis as any).__EXPO_RSC_RELOAD_LISTENERS__ ||= []);
    listeners.push(hmrReload);
    return () => listeners.splice(listeners.indexOf(hmrReload), 1);
  },
};

registerRootComponent(() => (
  <BundlerContext.Provider value={bundler}>
    <App />
  </BundlerContext.Provider>
));
