import { SharedItem } from './Props.js';

class SharedElementRegistry {
    private sharedElements: { [scene: string]: { [name: string]: HTMLElement } } = {};
    registerSharedElement(scene: string, name: string, ref: HTMLElement) {
        this.sharedElements[scene] = this.sharedElements[scene] || {};
        this.sharedElements[scene][name] = ref;
    }
    unregisterSharedElement(scene: string, name?: string) {
        if (this.sharedElements[scene]) {
            if (name)
                delete this.sharedElements[scene][name];
            else
                delete this.sharedElements[scene];
        }
    }
    getSharedElements(scene: string, oldScene: string) {
        if (scene === oldScene)
            return [];
        var oldSharedElements = this.sharedElements[oldScene];
        var mountedSharedElements = this.sharedElements[scene];
        var sharedElements: SharedItem[] = [];
        for(var name in mountedSharedElements) {
            if (oldSharedElements && oldSharedElements[name]) {
                sharedElements.push({
                    name,
                    oldElement: {ref: oldSharedElements[name], data: oldSharedElements[name]['sharedElementData']},
                    mountedElement: {ref: mountedSharedElements[name], data: mountedSharedElements[name]['sharedElementData']}
                });
            }
        }
        return sharedElements;
    }
}
export default SharedElementRegistry;
