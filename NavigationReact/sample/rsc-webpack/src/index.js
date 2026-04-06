import * as React from 'react';
import { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { encodeReply, createFromFetch } from 'react-server-dom-webpack/client';
import { BundlerContext } from 'navigation-react';

const serverCallback = async (actionId, args) => {
  const ind = args.findIndex(arg => typeof arg === 'function');
  if (ind !== -1) {
    const deserializeScene = args[ind];
    return deserializeScene(actionId, [...args.slice(0, ind), ...args.slice(ind + 1)]);
  }
  const res = await fetchRSC(window.location.href, {
    method: 'post',
    body: {actionId, args}
  });
  return res.data;
}  

const fetchRSC = async (url, options) => {
  const response = fetch(url, {
    ...options,
    headers: {Accept: 'text/x-component', ...options?.headers},
    body: options?.body ? await encodeReply(options.body) : undefined
  });
  return createFromFetch(response, {callServer: serverCallback});
}

const initialPayload = fetchRSC(window.location.pathname + window.location.search);
function Shell() {
  const root = useMemo(() => initialPayload, []);
  const bundler = useMemo(() => ({
    deserialize: fetchRSC,
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

