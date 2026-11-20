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
    const ind = args.findIndex(arg => typeof arg === 'function');
    if (ind !== -1) {
        const sceneViewAction = args[ind];
        return sceneViewAction(actionId, [...args.slice(0, ind), ...args.slice(ind +1)]);
    }
    const res = await fetchRSC(window.location.href, {body: {actionId, args}});
    return res.data;
});

ReactDOM.hydrateRoot(document, <Shell />);
