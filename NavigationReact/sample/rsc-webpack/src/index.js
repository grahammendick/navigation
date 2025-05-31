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

function Shell({data}) {
  const [root, setRoot] = useState(data);
  const bundler = useMemo(() => ({setRoot, deserialize: fetchRSC}), []);
  return (
    <BundlerContext.Provider value={bundler}>
      {root}
    </BundlerContext.Provider>
  );
}

const root = await fetchRSC(window.location.pathname + window.location.search);

ReactDOM.hydrateRoot(document, <Shell data={root} />);

