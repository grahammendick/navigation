'use client-entry';
import { hydrate, fetchRSC } from '@parcel/rsc/client';
import { StateNavigator, HTML5HistoryManager } from 'navigation';
import stateNavigator from "./stateNavigator";

const updateRoot = hydrate({
    onHmrReload() {
        const navigator = new StateNavigator(stateNavigator, new HTML5HistoryManager());
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
        updateRoot(root as any);
    }
});
