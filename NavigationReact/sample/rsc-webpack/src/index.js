import * as React from 'react';
import { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { encodeReply, createFromFetch, createTemporaryReferenceSet } from 'react-server-dom-webpack/client';
import { BundlerContext, createFetchRSC } from 'navigation-react';

const serverCallback = async (actionId, args) => {
  const ind = args.findIndex(arg => typeof arg === 'function');
  if (ind !== -1) {
    const sceneViewAction = args[ind];
    return sceneViewAction(actionId, [...args.slice(0, ind), ...args.slice(ind + 1)]);
  }
  const res = await fetchRSC(window.location.href, {body: {actionId, args}});
  return res.data;
}

const fetchRSC = createFetchRSC({
  createFromFetch: (response, options) => createFromFetch(response, {...options, callServer: serverCallback}),
  createTemporaryReferenceSet,
  encodeReply
});

const initialPayload = createFromFetch(fetch(window.location.pathname + window.location.search, {
  headers: {Accept: 'text/x-component'},
}), {callServer: serverCallback});
function Shell() {
  const root = useMemo(() => initialPayload, []);
  const bundler = useMemo(() => ({
    fetchRSC,
    onHmrReload: (hmrReload) => {
      const onHmrReload = (status) => {
          if (status !== 'idle') return;
          hmrReload();
      };
      import.meta.webpackHot?.addStatusHandler(onHmrReload);
      return () => import.meta.webpackHot?.removeStatusHandler(onHmrReload);
    },
  }), []);
  return (
    <BundlerContext.Provider value={bundler}>
      {root}
    </BundlerContext.Provider>
  );
}

ReactDOM.hydrateRoot(document, <Shell />);

