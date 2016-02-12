/// <reference path="navigation.d.ts" />
/// <reference path="angular.d.ts" />
/// <reference path="jquery.d.ts" />
import Navigation = require('navigation');
import angular = require('angular');
import jquery = require('jquery');

class LinkUtility {
    static setLink(stateController: Navigation.StateController, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, linkAccessor: () => string) {
        try {
            attrs.$set('href', stateController.historyManager.getHref(linkAccessor()));
        } catch (e) {
            attrs.$set('href', null);
        }
    }

    static getData(stateController: Navigation.StateController, toData, includeCurrentData: boolean, currentDataKeys: string): any {
        if (currentDataKeys)
            toData = stateController.stateContext.includeCurrentData(toData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            toData = stateController.stateContext.includeCurrentData(toData);
        return toData;
    }

    static isActive(stateController: Navigation.StateController, key: string, val: any): boolean {
        if (!stateController.stateContext.state)
            return false;
        if (val != null) {
            var trackTypes = stateController.stateContext.state.trackTypes;
            var currentVal = stateController.stateContext.data[key];
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
        var stateController: Navigation.StateController = scope.$eval(attrs['stateController']);
        element.on('click', (e: JQueryEventObject) => {
            var anchor = <HTMLAnchorElement> element[0];
            if (lazy)
                setLink();
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (anchor.href) {
                    var link = stateController.historyManager.getUrl(anchor);
                    var navigating = this.getNavigating($parse, attrs, scope);
                    if (navigating(e, link)) {
                        e.preventDefault();
                        var historyAction = scope.$eval(attrs['historyAction']);
                        if (typeof historyAction === 'string')
                            historyAction = Navigation.HistoryAction[historyAction];
                        stateController.navigateLink(link, historyAction);
                    }
                }
            }
        });
        if (!lazy) {
            stateController.onNavigate(setLink);
            element.on('$destroy', () => stateController.offNavigate(setLink));
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