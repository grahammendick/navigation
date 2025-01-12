declare module 'react-server-dom-parcel/client' {
    export function createFromFetch<T>(res: Promise<Response>): Promise<T>;
}
