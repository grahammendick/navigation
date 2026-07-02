import * as React from 'react';
import { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { encodeReply, createFromFetch, createTemporaryReferenceSet } from 'react-server-dom-webpack/client';
import { BundlerContext } from 'navigation-react';

const serverCallback = async (actionId, args) => {
  const ind = args.findIndex(arg => typeof arg === 'function');
  if (ind !== -1) {
    const fetchRSC = args[ind];
    return fetchRSC(actionId, [...args.slice(0, ind), ...args.slice(ind + 1)]);
  }
  const temporaryReferences = createTemporaryReferenceSet();
  const res = await createFromFetch(fetch(window.location.href, {
    method: 'post',
    headers: {Accept: 'text/x-component'},
    body: await encodeReply({actionId, args}, {temporaryReferences})
  }), {callServer: serverCallback});
  return res.data;
}  

const initialPayload = createFromFetch(fetch(window.location.pathname + window.location.search, {
  headers: {Accept: 'text/x-component'},
}), {callServer: serverCallback});
function Shell() {
  const root = useMemo(() => initialPayload, []);
  const bundler = useMemo(() => ({
    createTemporaryReferenceSet,
    encodeReply,
    createFromFetch: (response) => createFromFetch(response, {callServer: serverCallback}),
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

