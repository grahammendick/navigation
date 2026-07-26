declare module 'react-server-dom-parcel/client' {
    export function createFromReadableStream<T>(stream: ReadableStream<Uint8Array>, options?: object): Promise<T>;
    export function setServerCallback(callback:(id: string, args: any) => Promise<any>) : void;
    export function createFromFetch<T>(promiseForResponse: Promise<Response>, options?: object): Promise<T>;
    export function createTemporaryReferenceSet(): any;
    export const encodeReply: (v: unknown[], options?: unknown) => Promise<string | FormData>;
}
declare module 'react-server-dom-parcel/server.edge' {
    export function createTemporaryReferenceSet(): any;
    export function decodeReply(body: any, temporaryReferences: { temporaryReferences: any } ): Promise<any>;
    export function loadServerAction(id: string) : Promise<(args: any) => any>;
}
