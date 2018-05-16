import { SharedItem } from './Props';

class SharedElementRegistry {
    private sharedElements: { [scene: number]: { [name: string]: { ref: HTMLElement, data: any } } } = {};
    registerSharedElement(scene, name, ref, data) {
        this.sharedElements[scene] = this.sharedElements[scene] || {};
        this.sharedElements[scene][name] = {ref, data};
    }
    unregisterSharedElement(scene, name?) {
        if (this.sharedElements[scene]) {
            if (name)
                delete this.sharedElements[scene][name];
            else
                delete this.sharedElements[scene];
        }
    }
    getSharedElements(crumbs, oldUrl) {
        if (oldUrl === null || crumbs.length === oldUrl.split('crumb=').length - 1)
            return [];
        var oldSharedElements = this.sharedElements[oldUrl.split('crumb=').length - 1];
        var mountedSharedElements = this.sharedElements[crumbs.length];
        var sharedElements: SharedItem[] = [];
        for(var name in mountedSharedElements) {
            if (oldSharedElements && oldSharedElements[name]) {
                sharedElements.push({
                    name,
                    oldElement: oldSharedElements[name],
                    mountedElement: mountedSharedElements[name]
                });
            }
        }
        return sharedElements;
    }
}
export default SharedElementRegistry;
