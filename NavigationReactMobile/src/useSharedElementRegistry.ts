import { useCallback, useMemo, useState } from 'react';
import { SharedItem } from './Props';

const useSharedElementRegistry = () => {
    const [sharedElements, setSharedElements] = useState({});
    const registerSharedElement = useCallback((scene: number, name: string, ref: HTMLElement, data) => {
        setSharedElements(prevSharedElements => {
            const nextSharedElements = {...prevSharedElements};
            nextSharedElements[scene] = nextSharedElements[scene] || {};
            nextSharedElements[scene][name] = {ref, data};
            return nextSharedElements;
        })
    }, []);
    const unregisterSharedElement = useCallback((scene: number, name?: string) => {
        setSharedElements(prevSharedElements => {
            if (!prevSharedElements[scene]) return prevSharedElements;
            const nextSharedElements = {...prevSharedElements};
            if (name) delete nextSharedElements[scene][name];
            else delete nextSharedElements[scene];
            return nextSharedElements;
        })
    }, []);
    const getSharedElements = useCallback((scene: number, oldScene: number) => {
        if (scene === oldScene)
            return [];
        var oldSharedElements = sharedElements[oldScene];
        var mountedSharedElements = sharedElements[scene];
        var sharedEls: SharedItem[] = [];
        for(var name in mountedSharedElements) {
            if (oldSharedElements && oldSharedElements[name]) {
                sharedEls.push({
                    name,
                    oldElement: oldSharedElements[name],
                    mountedElement: mountedSharedElements[name]
                });
            }
        }
        return sharedEls.sort((a, b) => a.name.localeCompare(b.name));
    }, [sharedElements]);
    const sharedElementRegistry = useMemo(() => ({
        registerSharedElement,
        unregisterSharedElement,
        getSharedElements
    }), [registerSharedElement, unregisterSharedElement, getSharedElements]);
    return sharedElementRegistry;
}

export default useSharedElementRegistry;
