'use client-entry';
import { startTransition } from 'react';
import ReactDOM from 'react-dom/client';
import { createFromReadableStream, setServerCallback } from 'react-server-dom-parcel/client';
import { rscStream } from 'rsc-html-stream/client';
import { fetchRSC } from './Shell';

const initialPayload = createFromReadableStream<any>(rscStream);

setServerCallback(async (actionId: string, args: any[]) => {
    const res = await fetchRSC(window.location.href, {body: {actionId, args}});
    return res.data;
});

startTransition(() => {
    ReactDOM.hydrateRoot(document, initialPayload);
});
