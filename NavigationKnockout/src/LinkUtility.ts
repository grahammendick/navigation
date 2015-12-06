/// <reference path="navigation.d.ts" />
/// <reference path="knockout.d.ts" />
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
        if (currentDataKeys)
            toData = Navigation.StateContext.includeCurrentData(toData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            toData = Navigation.StateContext.includeCurrentData(toData);
        return toData;
    }

    static isActive(key: string, val: any): boolean {
        if (!Navigation.StateContext.state)
            return false;
        if (val != null) {
            var trackTypes = Navigation.StateContext.state.trackTypes;
            var currentVal = Navigation.StateContext.data[key];
            if (currentVal != null)
                return trackTypes ? val === currentVal : val.toString() == currentVal.toString();
            else
                return val === '';
        }
        return true;
    }

    static setActive(element: HTMLAnchorElement, active: boolean, activeCssClass: string, disableActive: boolean) {
        ko.utils.toggleDomNodeCssClass(element, activeCssClass, active)
        if (active && disableActive)
            element.removeAttribute('href');        
    }

    static addListeners(element: HTMLAnchorElement, setLink: () => void, allBindings: KnockoutAllBindingsAccessor, viewModel: any) {
        var lazy = !!allBindings.get('lazy');
        ko.utils.registerEventHandler(element, 'click', (e: MouseEvent) => {
            if (lazy)
                setLink();
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (element.href) {
                    var link = Navigation.settings.historyManager.getUrl(element);
                    var navigating = this.getNavigating(allBindings, viewModel);
                    if (navigating(e, link)) {
                        if (e.preventDefault)
                            e.preventDefault();
                        else
                            e['returnValue'] = false;
                        var historyAction = ko.unwrap(allBindings.get('historyAction'));
                        if (typeof historyAction === 'string')
                            historyAction = Navigation.HistoryAction[historyAction];
                        Navigation.StateController.navigateLink(link, false, historyAction);
                    }
                }
            }
        });
        if (!lazy) {
            Navigation.StateController.onNavigate(setLink);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => Navigation.StateController.offNavigate(setLink));
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
