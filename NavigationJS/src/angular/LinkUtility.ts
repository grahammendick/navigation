import Navigation = require('../Navigation');

class LinkUtility {
    static setLink(element: ng.IAugmentedJQuery, attrs: ng.IAttributes, linkAccessor: () => string) {
        try {
            attrs.$set('href', Navigation.historyManager.getHref(linkAccessor()));
        element.bind('click', (e) => this.onClick(e, <HTMLAnchorElement> element[0]));
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

    static onClick(e: JQueryEventObject, element: HTMLAnchorElement) {
        if (!e.ctrlKey && !e.shiftKey) {
            if (element.href) {
                e.preventDefault();
                Navigation.StateController.navigateLink(Navigation.historyManager.getUrl(element));
            }
        }
    }
}
export = LinkUtility; 