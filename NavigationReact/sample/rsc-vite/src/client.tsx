import * as ReactClient from '@vitejs/plugin-rsc/browser'
import { useState, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { rscStream } from 'rsc-html-stream/client'
import { createFromFetch } from "@vitejs/plugin-rsc/browser";
import { BundlerContext } from 'navigation-react';

async function fetchRSC(url: string, {body, ...options}: any) {
    return createFromFetch(fetch(url, {...options, body: JSON.stringify(body)}));
}

const initialPayload = ReactClient.createFromReadableStream<any>(rscStream)
function Shell() {
    const [root, setRoot] = useState(initialPayload);
    const bundler = useMemo(() => ({setRoot, deserialize: fetchRSC}), []);
    return (
        <BundlerContext.Provider value={bundler}>
            {root}
        </BundlerContext.Provider>
    );
}
ReactDOM.hydrateRoot(document, <Shell />);
