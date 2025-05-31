'use client-entry';
import { useState, useMemo, startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import { createFromReadableStream } from 'react-server-dom-parcel/client';
import { rscStream } from 'rsc-html-stream/client';
import { fetchRSC } from '@parcel/rsc/client';
import { BundlerContext } from 'navigation-react';

function Shell() {
    const [root, setRoot] = useState(() => createFromReadableStream(rscStream));
    const bundler = useMemo(() => ({setRoot, deserialize: fetchRSC}), []);
    return (
        <BundlerContext.Provider value={bundler}>
            {root}
        </BundlerContext.Provider>
    );
}

startTransition(() => {
    ReactDOM.hydrateRoot(document, <Shell />);
});
