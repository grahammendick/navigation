'use client-entry';
import { useMemo, startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import { createFromReadableStream } from 'react-server-dom-parcel/client';
import { rscStream } from 'rsc-html-stream/client';
import { fetchRSC } from '@parcel/rsc/client';
import { BundlerContext } from 'navigation-react';

function Shell() {
    const root = useMemo(() => createFromReadableStream(rscStream), []);
    const bundler = useMemo(() => {
        return {
            deserialize: fetchRSC,
            onHmrReload: (hmrReload: () => void) => {
                const onHmrReload = (e: any) => {
                    e.preventDefault();
                    hmrReload();
                };
                window.addEventListener('parcelhmrreload', onHmrReload);
                return () => window.removeEventListener('parcelhmrreload', onHmrReload);
            },
        }
    }, []);
    return (
        <BundlerContext.Provider value={bundler}>
            {root}
        </BundlerContext.Provider>
    );
}

startTransition(() => {
    ReactDOM.hydrateRoot(document, <Shell />);
});
