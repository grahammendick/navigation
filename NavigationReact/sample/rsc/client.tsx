"use client-entry";

import {use, startTransition, ReactElement} from 'react';
import ReactDOM from 'react-dom/client';
import {createFromReadableStream} from 'react-server-dom-parcel/client';
import {rscStream} from 'rsc-html-stream/client';

// Stream in initial RSC payload embedded in the HTML.
let initialRSCPayload = createFromReadableStream<ReactElement>(rscStream);

function Content() {
  return use(initialRSCPayload);
}

// Hydrate initial page content.
startTransition(() => {
  ReactDOM.hydrateRoot(document, <Content />);
});
