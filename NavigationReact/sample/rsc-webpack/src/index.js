import * as React from 'react';
import {use, Suspense, useState, startTransition, Profiler} from 'react';
import ReactDOM from 'react-dom/client';
import {createFromFetch, encodeReply} from 'react-server-dom-webpack/client';

function Shell({data}) {
  const [root, setRoot] = useState(data);
  return root;
}

async function hydrateApp() {
  const root = await createFromFetch(
    fetch(window.location.pathname + window.location.search, {
      headers: {
        Accept: 'text/x-component',
      },
    })
  );

  ReactDOM.hydrateRoot(
    document,
    <Profiler id="root">
      <Shell data={root} />
    </Profiler>,
    {}
  );
}

// Remove this line to simulate MPA behavior
hydrateApp();
