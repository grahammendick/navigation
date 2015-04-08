import Navigation = require('../Navigation');

class LinkUtility {
    static setLink(element: ng.IAugmentedJQuery, attrs: ng.IAttributes, linkAccessor: () => string) {
        try {
            attrs.$set('href', Navigation.historyManager.getHref(linkAccessor()));
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

    static addClickListener(element: ng.IAugmentedJQuery) {
        element.on('click', (e) => {
            var anchor = <HTMLAnchorElement> element[0];
            if (!e.ctrlKey && !e.shiftKey) {
                if (anchor.href) {
                    e.preventDefault();
                    Navigation.StateController.navigateLink(Navigation.historyManager.getUrl(anchor));
                }
            }
        });
    }

    static addNavigateHandler(element: ng.IAugmentedJQuery, handler) {
        Navigation.StateController.onNavigate(handler);
        element.on('$destroy', () => {
            Navigation.StateController.offNavigate(handler);
        });
    }
}
export = LinkUtility; 