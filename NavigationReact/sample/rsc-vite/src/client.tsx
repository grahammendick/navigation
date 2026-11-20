import { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { createFromReadableStream, setServerCallback, createTemporaryReferenceSet, encodeReply } from '@vitejs/plugin-rsc/browser'
import { rscStream } from 'rsc-html-stream/client'
import { createFromFetch } from '@vitejs/plugin-rsc/browser';
import { BundlerContext, createFetchRSC } from 'navigation-react';

const fetchRSC = createFetchRSC({createFromFetch, createTemporaryReferenceSet, encodeReply});
const initialPayload = createFromReadableStream<any>(rscStream)
function Shell() {
    const root = useMemo(() => initialPayload, []);
    const bundler = useMemo(() => ({
        fetchRSC,
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
    const res = await fetchRSC(window.location.href, {body: {actionId, args}});
    return res.data;
});

ReactDOM.hydrateRoot(document, <Shell />);
