/// <reference path="navigation.d.ts" />
/// <reference path="knockout.d.ts" />
import Navigation = require('navigation');
import ko = require('knockout');

class LinkUtility {
    static setLink(stateController: Navigation.StateController, element: HTMLAnchorElement, linkAccessor: () => string) {
        try {
            element.href = stateController.historyManager.getHref(linkAccessor());
        } catch (e) {
            element.removeAttribute('href');
        }
    }

    static getData(stateController: Navigation.StateController, toData, includeCurrentData, currentDataKeys) {
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

    static setActive(element: HTMLAnchorElement, active: boolean, activeCssClass: string, disableActive: boolean) {
        ko.utils.toggleDomNodeCssClass(element, activeCssClass, active)
        if (active && disableActive)
            element.removeAttribute('href');        
    }

    static addListeners(element: HTMLAnchorElement, setLink: () => void, allBindings: KnockoutAllBindingsAccessor, viewModel: any) {
        var lazy = !!allBindings.get('lazy');
        var stateController: Navigation.StateController = allBindings.get('stateController');
        ko.utils.registerEventHandler(element, 'click', (e: MouseEvent) => {
            if (lazy)
                setLink();
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (element.href) {
                    var link = stateController.historyManager.getUrl(element);
                    var navigating = this.getNavigating(allBindings, viewModel);
                    if (navigating(e, link)) {
                        if (e.preventDefault)
                            e.preventDefault();
                        else
                            e['returnValue'] = false;
                        var historyAction = ko.unwrap(allBindings.get('historyAction'));
                        if (typeof historyAction === 'string')
                            historyAction = Navigation.HistoryAction[historyAction];
                        stateController.navigateLink(link, historyAction);
                    }
                }
            }
        });
        if (!lazy) {
            stateController.onNavigate(setLink);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => stateController.offNavigate(setLink));
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
