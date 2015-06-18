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
        var navigate = this.getClickListener(element, setLink, lazy);
        var update = (e: MouseEvent) => setLink();
        if (window.addEventListener) {
            element.addEventListener('click', navigate);
            if (lazy)
                element.addEventListener('mousedown', update);
        } else {
            element['attachEvent']('onclick', navigate);
            if (lazy)
                element['attachEvent']('onmousedown', update);
        }
        if (!lazy) {
            Navigation.StateController.onNavigate(setLink);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => Navigation.StateController.offNavigate(setLink));
        }
    }

    private static getClickListener(element: HTMLAnchorElement, setLink: () => void, lazy: boolean) {
        return (e: MouseEvent) => {
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
        };
    }
}
export = LinkUtility;
