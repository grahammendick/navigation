'use client-entry';
import { useMemo, startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import { createFromReadableStream, setServerCallback, createFromFetch, createTemporaryReferenceSet, encodeReply } from 'react-server-dom-parcel/client';
import { rscStream } from 'rsc-html-stream/client';
import { BundlerContext, createFetchRSC } from 'navigation-react';

const fetchRSC = createFetchRSC({createFromFetch, createTemporaryReferenceSet, encodeReply});
const initialPayload = createFromReadableStream<any>(rscStream)
function Shell() {
    const root = useMemo(() => initialPayload, []);
    const bundler = useMemo(() => ({
        fetchRSC,
        onHmrReload: (hmrReload: () => void) => {
            const onHmrReload = (e: any) => {
                e.preventDefault();
                hmrReload();
            };
            window.addEventListener('parcelhmrreload', onHmrReload);
            return () => window.removeEventListener('parcelhmrreload', onHmrReload);
        },
    }), []);
    return (
        <BundlerContext.Provider value={bundler}>
            {root}
        </BundlerContext.Provider>
    );
}

setServerCallback(async (actionId: string, args: any[]) => {
    const res = await fetchRSC(window.location.href, {body: {actionId, args}});
    return res.data;
});

startTransition(() => {
    ReactDOM.hydrateRoot(document, <Shell />);
});
