import Navigation = require('navigation');
import ko = require('knockout');

class LinkUtility {
    static setLink(element: HTMLAnchorElement, linkAccessor: () => string) {
        try {
            element.href = Navigation.settings.historyManager.getHref(linkAccessor());
        } catch (e) {
            element.removeAttribute('href');
        }
    }

    static getData(toData, includeCurrentData, currentDataKeys) {
        if (currentDataKeys)
            toData = Navigation.StateContext.includeCurrentData(toData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            toData = Navigation.StateContext.includeCurrentData(toData);
        return toData;
    }

    static isActive(key: string, val: any): boolean {
        if (!Navigation.StateContext.state)
            return false;
        if (val != null && val.toString()) {
            var trackTypes = Navigation.StateContext.state.trackTypes;
            var currentVal = Navigation.StateContext.data[key];
            return currentVal != null && (trackTypes ? val === currentVal : val.toString() == currentVal.toString());
        }
        return true;
    }

    static setActive(element: HTMLAnchorElement, active: boolean, activeCssClass: string, disableActive: boolean) {
        ko.utils.toggleDomNodeCssClass(element, activeCssClass, active)
        if (active && disableActive)
            element.removeAttribute('href');        
    }

    static addListeners(element: HTMLAnchorElement, setLink: () => void, lazy: boolean, navigating?: (e: MouseEvent) => boolean) {
        ko.utils.registerEventHandler(element, 'click', (e: MouseEvent) => {
            if (lazy)
                setLink();
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (element.href) {
                    var handled = navigating(e);
                    if (!handled) {
                        if (e.preventDefault)
                            e.preventDefault();
                        else
                            e['returnValue'] = false;
                        Navigation.StateController.navigateLink(Navigation.settings.historyManager.getUrl(element));
                    }
                }
            }
        });
        if (!lazy) {
            Navigation.StateController.onNavigate(setLink);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => Navigation.StateController.offNavigate(setLink));
        } else {
            ko.utils.registerEventHandler(element, 'mousedown', (e: MouseEvent) => setLink());
            ko.utils.registerEventHandler(element, 'contextmenu', (e: MouseEvent) => setLink());
        }
    }
}
export = LinkUtility;
