import Navigation = require('../Navigation');
import ko = require('knockout');

class LinkUtility {
    static setLink(element: HTMLAnchorElement, linkAccessor: () => string) {
        if (element.getAttribute('data-state-context-url') !== Navigation.StateContext.url) {
            try {
                element.href = Navigation.historyManager.getHref(linkAccessor());
            } catch (e) {
                element.removeAttribute('href');
            }
            element.setAttribute('data-state-context-url', Navigation.StateContext.url);
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

    static addClickListener(element: HTMLAnchorElement) {
        var navigate = (e: MouseEvent) => {
            if (!e.ctrlKey && !e.shiftKey) {
                if (element.href) {
                    e.preventDefault();
                    Navigation.StateController.navigateLink(Navigation.historyManager.getUrl(element));
                }
            }
        }
        if (window.addEventListener)
            element.addEventListener('click', navigate);
        else
            element.attachEvent('click', navigate);
    }

    static addNavigateHandler(element, handler) {
        Navigation.StateController.onNavigate(handler);
        ko.utils.domNodeDisposal.addDisposeCallback(element, () => Navigation.StateController.offNavigate(handler));
    }
}
export = LinkUtility;
