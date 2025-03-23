import * as React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { createFromFetch } from 'react-server-dom-webpack/client';
import HmrContext from './HmrContext.js';

function Shell({data}) {
  const [root, setRoot] = useState(data);
  return (
    <HmrContext.Provider value={setRoot}>
        {root}
    </HmrContext.Provider>
  );
}

const root = await createFromFetch(
  fetch(window.location.pathname + window.location.search, {
    headers: {
      Accept: 'text/x-component',
    },
  })
);

ReactDOM.hydrateRoot(document, <Shell data={root} />);

