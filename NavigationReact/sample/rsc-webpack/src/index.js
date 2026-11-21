import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { encodeReply, createFromFetch, createTemporaryReferenceSet } from 'react-server-dom-webpack/client';
import { BundlerContext, createFetchRSC } from 'navigation-react';

const serverCallback = async (actionId, args) => {
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
const bundler = {
  fetchRSC,
  onHmrReload: (hmrReload) => {
    const onHmrReload = (status) => {
        if (status !== 'idle') return;
        hmrReload();
    };
    import.meta.webpackHot?.addStatusHandler(onHmrReload);
    return () => import.meta.webpackHot?.removeStatusHandler(onHmrReload);
  },
};

ReactDOM.hydrateRoot(document, (
  <BundlerContext.Provider value={bundler}>
    {initialPayload}
  </BundlerContext.Provider>
));

