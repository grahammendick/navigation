/// <reference path="navigation.d.ts" />
/// <reference path="angular.d.ts" />
/// <reference path="jquery.d.ts" />
import { StateNavigator } from 'navigation';
import * as angular from 'angular';
import * as jquery from 'jquery';

class LinkUtility {
    static setLink(stateNavigator: StateNavigator, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, linkAccessor: () => string) {
        try {
            attrs.$set('href', stateNavigator.historyManager.getHref(linkAccessor()));
        } catch (e) {
            attrs.$set('href', null);
        }
    }

    static getData(stateNavigator: StateNavigator, navigationData, includeCurrentData: boolean, currentDataKeys: string): any {
        if (currentDataKeys)
            navigationData = stateNavigator.stateContext.includeCurrentData(navigationData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            navigationData = stateNavigator.stateContext.includeCurrentData(navigationData);
        return navigationData;
    }

    static setActive(element: ng.IAugmentedJQuery, stateNavigator: StateNavigator, attrs: ng.IAttributes, navigationData, activeCssClass, disableActive) {
        if (!activeCssClass && !disableActive)
            return;
        var active = !!attrs['href'];
        for (var key in navigationData) {
            var val = navigationData[key];
            active = active && (val == null || this.areEqual(val, stateNavigator.stateContext.data[key]));
        }
        element.toggleClass(activeCssClass, active);
        if (active && disableActive)
            attrs.$set('href', null);
    }

    private static areEqual(val: any, currentVal: any): boolean {
        if (currentVal == null)
            return val == null || val === '';
        var valType = Object.prototype.toString.call(val);
        if (valType !== Object.prototype.toString.call(currentVal))
            return false;
        if (valType === '[object Array]') {
            var active = val.length === currentVal.length;
            for(var i = 0; active && i < val.length; i++) {
                active = this.areEqual(val[i], currentVal[i]);
            }
            return active;
        } else {
            return isNaN(val) ? val === currentVal : +val === +currentVal;
        }
    }

    static addListeners(element: ng.IAugmentedJQuery, setLink: () => void, $parse: ng.IParseService, attrs: ng.IAttributes, scope: ng.IScope) {
        var lazy = !!scope.$eval(attrs['lazy']);
        var stateNavigator: StateNavigator = scope.$eval(attrs['stateNavigator']);
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
export default LinkUtility;
