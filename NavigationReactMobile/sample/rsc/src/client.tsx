'use client-entry';
import { useState, startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import { createFromReadableStream } from 'react-server-dom-parcel/client';
import { rscStream } from 'rsc-html-stream/client';
import HmrContext from './HmrContext';

function Shell() {
    let [root, setRoot] = useState(() => createFromReadableStream(rscStream));
    return (
        <HmrContext.Provider value={setRoot}>
            {root}
        </HmrContext.Provider>
    );
}

startTransition(() => {
    ReactDOM.hydrateRoot(document, <Shell />);
});
