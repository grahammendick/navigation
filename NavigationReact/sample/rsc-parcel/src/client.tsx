'use client-entry';
import { useMemo, startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import { createFromReadableStream, setServerCallback, createTemporaryReferenceSet, encodeReply, createFromFetch } from 'react-server-dom-parcel/client';
import { rscStream } from 'rsc-html-stream/client';
import { BundlerContext } from 'navigation-react';

async function fetchRSC(url: string, {body, ...options}: any) {
    const temporaryReferences = createTemporaryReferenceSet();
    return fetch(url, {...options, body: await encodeReply(body, {temporaryReferences})});
}

function Shell() {
    const root = useMemo(() => createFromReadableStream(rscStream), []);
    const bundler = useMemo(() => {
        return {
            deserialize: fetchRSC,
            createFromFetch,
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

setServerCallback(async (actionId: string, args: any[]) => {
    const ind = args.findIndex(arg => typeof arg === 'function');
    if (ind !== -1) {
        const deserializeScene = args[ind];
        return deserializeScene(actionId, [...args.slice(0, ind), ...args.slice(ind +1)]);
    }
    const res = await fetchRSC(window.location.href, {
        method: 'post',
        body: {actionId, args}
    }) as any;
    return res.data;
});

startTransition(() => {
    ReactDOM.hydrateRoot(document, <Shell />);
});
