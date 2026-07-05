import { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { createFromReadableStream, setServerCallback, createTemporaryReferenceSet, encodeReply } from '@vitejs/plugin-rsc/browser'
import { rscStream } from 'rsc-html-stream/client'
import { createFromFetch } from '@vitejs/plugin-rsc/browser';
import { BundlerContext } from 'navigation-react';

const initialPayload = createFromReadableStream<any>(rscStream)
function Shell() {
    const root = useMemo(() => initialPayload, []);
    const bundler = useMemo(() => ({
        createTemporaryReferenceSet,
        encodeReply,
        createFromFetch,
        onHmrReload: (hmrReload: () => void) => {
            import.meta.hot?.on("rsc:update", hmrReload);
            return () => import.meta.hot?.off("rsc:update", hmrReload);
        }
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

ReactDOM.hydrateRoot(document, <Shell />);
