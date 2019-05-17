class SharedElementRegistryProxy {
    registerSharedElement(scene: number, name: string, ref: HTMLElement, data) {
        var eventData = {bubbles: true, detail: {name, data, share: true}};
        ref.dispatchEvent(new CustomEvent('share', eventData));
    }
    unregisterSharedElement(scene: number, name?: string, ref?: HTMLElement) {
        if (ref) {
            var eventData = {bubbles: true, detail: {name, share: false}};
            ref.dispatchEvent(new CustomEvent('share', eventData));
        }
    }
    getSharedElements(scene: number, oldScene: number) {
        return [];
    }
}
export default SharedElementRegistryProxy;
