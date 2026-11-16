const createPrefetchStream = () => {
    const queue: {key: string, content: any}[] = [];
    let open = 0, wake: () => void = null;
    const notify = () => {
        wake?.();
        wake = null;
    };
    return {
        push(sceneView: {key: string, content: any}) {
            queue.push(sceneView);
            notify();
        },
        start() {
            open++;
        },
        finish() {
            open--;
            notify();
        },
        async *[Symbol.asyncIterator]() {
            while (true) {
                while (queue.length) yield queue.shift();
                if (open === 0) return;
                await new Promise<void>(resolve => wake = resolve);
            }
        }
    };
};
export default createPrefetchStream;
