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
        var data = {};
        toData = ko.unwrap(toData);
        for (var key in toData) {
            data[key] = ko.unwrap(toData[key]);
        }
        includeCurrentData = ko.unwrap(includeCurrentData);
        currentDataKeys = ko.unwrap(currentDataKeys);
        if (currentDataKeys)
            data = Navigation.StateContext.includeCurrentData(data, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            data = Navigation.StateContext.includeCurrentData(data);
        return data;
    }

    static addListeners(element: HTMLAnchorElement, setLink: () => void, lazy: boolean) {
        this.addClickListener(element, setLink, lazy);
        if (lazy)
            this.addListener(element, 'mousedown', (e: MouseEvent) => setLink());
        if (!lazy) {
            Navigation.StateController.onNavigate(setLink);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => Navigation.StateController.offNavigate(setLink));
        }
    }

    private static addClickListener(element: HTMLAnchorElement, setLink: () => void, lazy: boolean) {
        this.addListener(element, 'click', (e: MouseEvent) => {
            if (lazy)
                setLink();
            if (!e.ctrlKey && !e.shiftKey) {
                if (element.href) {
                    if (e.preventDefault)
                        e.preventDefault();
                    else
                        e['returnValue'] = false;
                    Navigation.StateController.navigateLink(Navigation.settings.historyManager.getUrl(element));
                }
            }
        });
    }
    
    private static addListener(element: HTMLAnchorElement, type: string, listener: (e: MouseEvent) => void) {
        if (window.addEventListener)
            element.addEventListener(type, listener);
        else
            element['attachEvent']('on' + type, listener);        
    }
}
export = LinkUtility;
