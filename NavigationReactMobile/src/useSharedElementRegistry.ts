import { useCallback, useMemo, useState } from 'react';
import { SharedItem } from './Props.js';

const useSharedElementRegistry = () => {
    const [sharedElements, setSharedElements] = useState({});
    const registerSharedElement = useCallback((scene: string, name: string, ref: HTMLElement) => {
        setSharedElements(prevSharedElements => {
            const nextSharedElements = {...prevSharedElements};
            nextSharedElements[scene] = nextSharedElements[scene] || {};
            nextSharedElements[scene][name] = ref;
            return nextSharedElements;
        })
    }, []);
    const unregisterSharedElement = useCallback((scene: string, name?: string) => {
        setSharedElements(prevSharedElements => {
            if (!prevSharedElements[scene]) return prevSharedElements;
            const nextSharedElements = {...prevSharedElements};
            if (name) delete nextSharedElements[scene][name];
            else delete nextSharedElements[scene];
            return nextSharedElements;
        })
    }, []);
    const getSharedElements = useCallback((scene: string, oldScene: string) => {
        if (scene === oldScene)
            return [];
        var oldSharedElements = sharedElements[oldScene];
        var mountedSharedElements = sharedElements[scene];
        var sharedEls: SharedItem[] = [];
        for(var name in mountedSharedElements) {
            if (oldSharedElements && oldSharedElements[name]) {
                sharedEls.push({
                    name,
                    oldElement: {ref: oldSharedElements[name], data: oldSharedElements[name]['sharedElementData']},
                    mountedElement: {ref: mountedSharedElements[name], data: mountedSharedElements[name]['sharedElementData']}
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
