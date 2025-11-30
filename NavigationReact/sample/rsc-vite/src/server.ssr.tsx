import * as ReactClient from '@vitejs/plugin-rsc/ssr';
import React from 'react';
import * as ReactDOMServer from 'react-dom/server.edge';
import { injectRSCPayload } from 'rsc-html-stream/server';

export async function renderHTML(
  rscStream: ReadableStream<Uint8Array>) {
  const [rscStream1, rscStream2] = rscStream.tee();
  let payload: Promise<React.ReactNode>;
  function SsrRoot() {
    payload ??= ReactClient.createFromReadableStream<React.ReactNode>(rscStream1);
    return React.use(payload);
  }
  const bootstrapScriptContent =
    await import.meta.viteRsc.loadBootstrapScriptContent('index');
  const htmlStream = await ReactDOMServer.renderToReadableStream(<SsrRoot />, {
    bootstrapScriptContent,
  });
  let responseStream: ReadableStream<Uint8Array> = htmlStream;
  responseStream = responseStream.pipeThrough(
    injectRSCPayload(rscStream2),
  );
  return responseStream;
}
