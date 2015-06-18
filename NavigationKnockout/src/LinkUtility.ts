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

    static addClickListener(element: HTMLAnchorElement, setLink: () => void) {
        var navigate = (e: MouseEvent) => {
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
        var update = (e: MouseEvent) => setLink();
        if (window.addEventListener) {
            element.addEventListener('click', navigate);
            element.addEventListener('mousedown', update);
        } else {
            element['attachEvent']('onclick', navigate);
            element['attachEvent']('onmousedown', update);
        }
    }

    static addNavigateHandler(element: HTMLAnchorElement, handler: () => void) {
        Navigation.StateController.onNavigate(handler);
        ko.utils.domNodeDisposal.addDisposeCallback(element, () => Navigation.StateController.offNavigate(handler));
    }
}
export = LinkUtility;
