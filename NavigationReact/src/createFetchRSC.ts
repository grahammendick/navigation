const createFetchRSC = ({createFromFetch, createTemporaryReferenceSet, encodeReply}: {createFromFetch: (promiseForResponse: Promise<Response>, options?: object) => Promise<any>, createTemporaryReferenceSet: () => any, encodeReply: (v: any, options?: any) => Promise<string | FormData>}) => (
    async (url: string, {body, headers, signal}: {body: any, headers?: Record<string, string>, signal?: AbortSignal}) => {
        const temporaryReferences = createTemporaryReferenceSet();
        const responsePromise = (async () => {
            let response = null;
            try {
                response = await fetch(url, {
                    method: 'post',
                    headers: {Accept: 'text/x-component', ...headers},
                    body: await encodeReply(body, {temporaryReferences}),
                    signal
                });
            } catch(e) {
                if (!signal?.aborted) throw e;
                else return new Promise(() => {}) as Promise<Response>;
            }
            const reader = response.body.getReader();
            const customStream = new ReadableStream({
                async pull(controller) {
                    try {
                        const {done, value} = await reader.read();
                        if (!done) controller.enqueue(value);
                        else controller.close();
                    } catch(e) {
                        if (!signal?.aborted) controller.error(e);
                    }
                }
            });
            return new Response(customStream, {headers: response.headers});
        })();
        return createFromFetch(responsePromise, {temporaryReferences});
    }
);

export default createFetchRSC;
