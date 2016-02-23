/// <reference path="navigation.d.ts" />
/// <reference path="angular.d.ts" />
/// <reference path="jquery.d.ts" />
import Navigation = require('navigation');
import angular = require('angular');
import jquery = require('jquery');

class LinkUtility {
    static setLink(stateNavigator: Navigation.StateNavigator, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, linkAccessor: () => string) {
        try {
            attrs.$set('href', stateNavigator.historyManager.getHref(linkAccessor()));
        } catch (e) {
            attrs.$set('href', null);
        }
    }

    static getData(stateNavigator: Navigation.StateNavigator, navigationData, includeCurrentData: boolean, currentDataKeys: string): any {
        if (currentDataKeys)
            navigationData = stateNavigator.stateContext.includeCurrentData(navigationData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            navigationData = stateNavigator.stateContext.includeCurrentData(navigationData);
        return navigationData;
    }

    static isActive(stateNavigator: Navigation.StateNavigator, key: string, val: any): boolean {
        if (!stateNavigator.stateContext.state)
            return false;
        if (val != null) {
            var trackTypes = stateNavigator.stateContext.state.trackTypes;
            var currentVal = stateNavigator.stateContext.data[key];
            if (currentVal != null)
                return trackTypes ? val === currentVal : val.toString() == currentVal.toString();
            else
                return val === '';
        }
        return true;
    }

    static setActive(element: ng.IAugmentedJQuery, attrs: ng.IAttributes, active: boolean, activeCssClass: string, disableActive: boolean) {
        element.toggleClass(activeCssClass, active);
        if (active && disableActive)
            attrs.$set('href', null);
    }

    static addListeners(element: ng.IAugmentedJQuery, setLink: () => void, $parse: ng.IParseService, attrs: ng.IAttributes, scope: ng.IScope) {
        var lazy = !!scope.$eval(attrs['lazy']);
        var stateNavigator: Navigation.StateNavigator = scope.$eval(attrs['stateNavigator']);
        element.on('click', (e: JQueryEventObject) => {
            var anchor = <HTMLAnchorElement> element[0];
            if (lazy)
                setLink();
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (anchor.href) {
                    var link = stateNavigator.historyManager.getUrl(anchor);
                    var navigating = this.getNavigating($parse, attrs, scope);
                    if (navigating(e, link)) {
                        e.preventDefault();
                        stateNavigator.navigateLink(link, scope.$eval(attrs['historyAction']));
                    }
                }
            }
        });
        if (!lazy) {
            stateNavigator.onNavigate(setLink);
            element.on('$destroy', () => stateNavigator.offNavigate(setLink));
        } else {
            element.on('mousedown', (e) => setLink());
            element.on('contextmenu', (e) => setLink());
        }
    }

    static getNavigating($parse: ng.IParseService, attrs: ng.IAttributes, scope: ng.IScope): (e: JQueryEventObject, link: string) => boolean {
        return (e: JQueryEventObject, link: string) => {
            var listener = attrs['navigating'] ? $parse(attrs['navigating']) : null;
            if (listener)
                return listener(scope, { $event: e, url: link });
            return true;
        }
    }
}
export = LinkUtility; 