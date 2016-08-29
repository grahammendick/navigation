/// <reference path="navigation.d.ts" />
/// <reference path="knockout.d.ts" />
import Navigation = require('navigation');
import ko = require('knockout');

class LinkUtility {
    static setLink(stateNavigator: Navigation.StateNavigator, element: HTMLAnchorElement, linkAccessor: () => string) {
        try {
            element.href = stateNavigator.historyManager.getHref(linkAccessor());
        } catch (e) {
            element.removeAttribute('href');
        }
    }

    static getData(stateNavigator: Navigation.StateNavigator, navigationData, includeCurrentData, currentDataKeys) {
        if (currentDataKeys)
            navigationData = stateNavigator.stateContext.includeCurrentData(navigationData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            navigationData = stateNavigator.stateContext.includeCurrentData(navigationData);
        return navigationData;
    }

    static setActive(element: HTMLAnchorElement, stateNavigator: Navigation.StateNavigator, navigationData, activeCssClass, disableActive) {
        if (!activeCssClass && !disableActive)
            return;
        var active = !!element.href;
        for (var key in navigationData) {
            var val = navigationData[key];
            active = active && (val == null || this.areEqual(val, stateNavigator.stateContext.data[key]));
        }
        ko.utils.toggleDomNodeCssClass(element, activeCssClass, active)
        if (active && disableActive)
            element.removeAttribute('href');        
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

    static addListeners(element: HTMLAnchorElement, setLink: () => void, allBindings: KnockoutAllBindingsAccessor, viewModel: any) {
        var lazy = !!allBindings.get('lazy');
        var stateNavigator: Navigation.StateNavigator = allBindings.get('stateNavigator');
        ko.utils.registerEventHandler(element, 'click', (e: MouseEvent) => {
            if (lazy)
                setLink();
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (element.href) {
                    var link = stateNavigator.historyManager.getUrl(element);
                    var navigating = this.getNavigating(allBindings, viewModel);
                    if (navigating(e, link)) {
                        if (e.preventDefault)
                            e.preventDefault();
                        else
                            e['returnValue'] = false;
                        stateNavigator.navigateLink(link, ko.unwrap(allBindings.get('historyAction')));
                    }
                }
            }
        });
        if (!lazy) {
            stateNavigator.onNavigate(setLink);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => stateNavigator.offNavigate(setLink));
        } else {
            ko.utils.registerEventHandler(element, 'mousedown', (e: MouseEvent) => setLink());
            ko.utils.registerEventHandler(element, 'contextmenu', (e: MouseEvent) => setLink());
        }
    }

    static getNavigating(allBindings: KnockoutAllBindingsAccessor, viewModel: any): (e: MouseEvent, link: string) => boolean {
        return (e: MouseEvent, link: string) => {
            var listener = ko.unwrap(allBindings.get('navigating'));
            if (listener)
                return listener.call(viewModel, viewModel, e, link);
            return true;
        }
    }
}
export = LinkUtility;
