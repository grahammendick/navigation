import ReactDOM from 'react-dom/client';
import { createFromReadableStream, setServerCallback, createFromFetch, createTemporaryReferenceSet, encodeReply } from '@vitejs/plugin-rsc/browser'
import { rscStream } from 'rsc-html-stream/client'
import { BundlerContext, createFetchRSC } from 'navigation-react';

const fetchRSC = createFetchRSC({createFromFetch, createTemporaryReferenceSet, encodeReply});
const initialPayload = createFromReadableStream<any>(rscStream)
const bundler = {
    fetchRSC,
    onHmrReload: (hmrReload: () => void) => {
        import.meta.hot?.on("rsc:update", hmrReload);
        return () => import.meta.hot?.off("rsc:update", hmrReload);
    }
};

setServerCallback(async (actionId: string, args: any[]) => {
    const res = await fetchRSC(window.location.href, {body: {actionId, args}});
    return res.data;
});

ReactDOM.hydrateRoot(document, (
    <BundlerContext.Provider value={bundler}>
        {initialPayload}
    </BundlerContext.Provider>
));
