'use client-entry';
import { useState, startTransition, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createFromReadableStream } from 'react-server-dom-parcel/client';
import { fetchRSC } from '@parcel/rsc/client';
import { rscStream } from 'rsc-html-stream/client';
import { StateNavigator, HTML5HistoryManager } from 'navigation';
import stateNavigator from "./stateNavigator";

function Shell() {
    let [root, setRoot] = useState(() => (
        createFromReadableStream(rscStream)
    ));
    useEffect(() => {
        const onHmrReload = (e: any) => {
            e.preventDefault();
            const navigator = new StateNavigator(stateNavigator, new HTML5HistoryManager('app'));
            navigator.historyManager.stop();
            navigator.start();
            const {stateContext: {state, data, crumbs, nextCrumb: {crumblessUrl}}} = navigator;
            const root = fetchRSC(navigator.historyManager.getHref(crumblessUrl), {
                method: 'put',
                headers: {
                    Accept: 'text/x-component',
                    'Content-Type': 'application/json'
                },
                body: {
                    crumbs: crumbs.map(({state, data}) => ({state: state.key, data})),
                    state: state.key,
                    data
                }
            });
            setRoot(root);
        }
        window.addEventListener('parcelhmrreload', onHmrReload);
        return () => window.removeEventListener('parcelhmrreload', onHmrReload);
    })
    return root;
}

startTransition(() => {
    ReactDOM.hydrateRoot(
        document,
        <Shell />,
        {}
    );
});
