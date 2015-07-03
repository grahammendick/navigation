import Navigation = require('navigation');
import angular = require('angular');
import jquery = require('jquery');

class LinkUtility {
    static setLink(element: ng.IAugmentedJQuery, attrs: ng.IAttributes, linkAccessor: () => string) {
        try {
            attrs.$set('href', Navigation.settings.historyManager.getHref(linkAccessor()));
        } catch (e) {
            attrs.$set('href', null);
        }
    }

    static getData(toData, includeCurrentData: boolean, currentDataKeys: string): any {
        if (currentDataKeys)
            toData = Navigation.StateContext.includeCurrentData(toData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            toData = Navigation.StateContext.includeCurrentData(toData);
        return toData;
    }
    
    static addListeners(element: ng.IAugmentedJQuery, setLink: () => void, lazy: boolean) {
        element.on('click', (e: JQueryEventObject) => {
            var anchor = <HTMLAnchorElement> element[0];
            if (lazy)
                setLink();
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (anchor.href) {
                    e.preventDefault();
                    Navigation.StateController.navigateLink(Navigation.settings.historyManager.getUrl(anchor));
                }
            }
        });
        if (!lazy) {
            Navigation.StateController.onNavigate(setLink);
            element.on('$destroy', () => Navigation.StateController.offNavigate(setLink));
        } else {
            element.on('mousedown', (e) => setLink());
        }
    }
}
export = LinkUtility; 