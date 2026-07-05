'use client-entry';
import { useMemo, startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import { createFromReadableStream, setServerCallback, createFromFetch, createTemporaryReferenceSet, encodeReply } from 'react-server-dom-parcel/client';
import { rscStream } from 'rsc-html-stream/client';
import { BundlerContext } from 'navigation-react';

const initialPayload = createFromReadableStream<any>(rscStream)
function Shell() {
    const root = useMemo(() => initialPayload, []);
    const bundler = useMemo(() => ({
        createTemporaryReferenceSet,
        encodeReply,
        createFromFetch,
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
    const ind = args.findIndex(arg => typeof arg === 'function');
    if (ind !== -1) {
        const fetchRSC = args[ind];
        return fetchRSC(actionId, [...args.slice(0, ind), ...args.slice(ind +1)]);
    }
    const temporaryReferences = createTemporaryReferenceSet();
    const res = await createFromFetch<{data: any}>(fetch(window.location.href, {
        method: 'post',
        body: await encodeReply({actionId, args} as any, {temporaryReferences})
    }));
    return res.data;
});

startTransition(() => {
    ReactDOM.hydrateRoot(document, <Shell />);
});
