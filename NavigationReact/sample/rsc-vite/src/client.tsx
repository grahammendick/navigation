import * as ReactClient from '@vitejs/plugin-rsc/browser'
import { useState, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { rscStream } from 'rsc-html-stream/client'
import { createFromFetch } from "@vitejs/plugin-rsc/browser";
import { BundlerContext } from 'navigation-react';


async function hydrate() {
    const initialPayload = await ReactClient.createFromReadableStream<any>(rscStream)
    function Shell() {
        const [root, setRoot] = useState(initialPayload.root);
        const bundler = useMemo(() => ({setRoot, deserialize: fetchRSC}), []);
        return (
            <BundlerContext.Provider value={bundler}>
                {root}
            </BundlerContext.Provider>
        );
    }
    ReactDOM.hydrateRoot(document, <Shell />);
}
async function fetchRSC(url: string, {body, ...options}: any) {
    const payload = await createFromFetch(fetch(url, {...options, body: JSON.stringify(body)})) as any;
    return payload.root;
}
hydrate();
