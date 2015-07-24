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
        if (val != null && val.toString()) {
            var trackTypes = Navigation.StateContext.state.trackTypes;
            var currentVal = Navigation.StateContext.data[key];
            return currentVal != null && (trackTypes ? val === currentVal : val.toString() == currentVal.toString());
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
                    var navigate = this.getNavigating(allBindings, viewModel, link)(e);
                    if (navigate) {
                        if (e.preventDefault)
                            e.preventDefault();
                        else
                            e['returnValue'] = false;
                        Navigation.StateController.navigateLink(link);
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
    
    static getNavigating(allBindings: KnockoutAllBindingsAccessor, viewModel: any, link: string): (e: MouseEvent) => boolean {
        return (e: MouseEvent) => {
            var listener = ko.unwrap(allBindings.get('navigating'));
            if (listener)
                return listener.call(viewModel, viewModel, e, link);
            return true;
        }
    }
}
export = LinkUtility;
