import * as React from 'react';
import { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { encodeReply, createFromFetch } from 'react-server-dom-webpack/client';
import { BundlerContext } from 'navigation-react';

const fetchRSC = async (url, options) => {
  const response = fetch(url, {
    ...options,
    headers: {
      Accept: 'text/x-component',
      ...options?.headers,
    },
    body: options && 'body' in options 
      ? await encodeReply(options.body)
      : undefined,
  });
  return createFromFetch(response);
}

const initialPayload = fetchRSC(window.location.pathname + window.location.search);
function Shell() {
  const root = useMemo(() => initialPayload, []);
  const bundler = useMemo(() => ({
    deserialize: fetchRSC,
    onHmrReload: (hmrReload) => {
      onHmrReload = (status) => {
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

