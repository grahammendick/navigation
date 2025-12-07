import { use, type ReactNode } from 'react';
import { createFromReadableStream } from '@vitejs/plugin-rsc/ssr';
import { renderToReadableStream } from 'react-dom/server.edge';
import { injectRSCPayload } from 'rsc-html-stream/server';

export async function renderHTML(
  rscStream: ReadableStream<Uint8Array>) {
  const [rscStream1, rscStream2] = rscStream.tee();
  let payload: Promise<ReactNode>;
  function SsrRoot() {
    payload ??= createFromReadableStream<ReactNode>(rscStream1);
    return use(payload);
  }
  const bootstrapScriptContent =
    await import.meta.viteRsc.loadBootstrapScriptContent('index');
  const htmlStream = await renderToReadableStream(<SsrRoot />, {
    bootstrapScriptContent,
  });
  let responseStream: ReadableStream<Uint8Array> = htmlStream;
  responseStream = responseStream.pipeThrough(
    injectRSCPayload(rscStream2),
  );
  return responseStream;
}
