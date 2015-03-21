module Navigation.Knockout {
    ko.bindingHandlers['navigationLink'] = {
        init: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
            addClickListener(element);
            var navigateHandler = () => {
                setNavigationLink(element, valueAccessor, allBindings);
            }
            Navigation.StateController.onNavigate(navigateHandler);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                Navigation.StateController.offNavigate(navigateHandler);
            });
        },
        update: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
            element.removeAttribute('data-state-context-url');
            setNavigationLink(element, valueAccessor, allBindings);
        }
    };

    function setNavigationLink(element: HTMLAnchorElement, valueAccessor, allBindings: KnockoutAllBindingsAccessor) {
        if (element.getAttribute('data-state-context-url') !== Navigation.StateContext.url) {
            var link = Navigation.StateController.getNavigationLink(ko.unwrap(valueAccessor()),
                getData(allBindings.get('toData'), allBindings.get('includeCurrentData'), allBindings.get('currentDataKeys')));
            element.href = Navigation.historyManager.getHref(link);
            element.setAttribute('data-state-context-url', Navigation.StateContext.url);
        }
    }

    ko.bindingHandlers['navigationBackLink'] = {
        init: (element, valueAccessor) => {
            addClickListener(element);
            var navigateHandler = () => {
                setNavigationBackLink(element, valueAccessor);
            }
            Navigation.StateController.onNavigate(navigateHandler);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                Navigation.StateController.offNavigate(navigateHandler);
            });
        },
        update: (element, valueAccessor) => {
            element.removeAttribute('data-state-context-url');
            setNavigationBackLink(element, valueAccessor);
        }
    };

    function setNavigationBackLink(element: HTMLAnchorElement, valueAccessor) {
        if (element.getAttribute('data-state-context-url') !== Navigation.StateContext.url) {
            var link = Navigation.StateController.getNavigationBackLink(ko.unwrap(valueAccessor()));
            element['href'] = Navigation.historyManager.getHref(link);
            element.setAttribute('data-state-context-url', Navigation.StateContext.url);
        }
    }

    ko.bindingHandlers['refreshLink'] = {
        init: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
            addClickListener(element);
            var navigateHandler = () => {
                setRefreshLink(element, valueAccessor, allBindings);
            }
            Navigation.StateController.onNavigate(navigateHandler);
            ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
                Navigation.StateController.offNavigate(navigateHandler);
            });
        },
        update: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
            element.removeAttribute('data-state-context-url');
            setRefreshLink(element, valueAccessor, allBindings);
        }
    };

    function setRefreshLink(element: HTMLAnchorElement, valueAccessor, allBindings: KnockoutAllBindingsAccessor) {
        if (element.getAttribute('data-state-context-url') !== Navigation.StateContext.url) {
            var link = Navigation.StateController.getRefreshLink(
                getData(valueAccessor(), allBindings.get('includeCurrentData'), allBindings.get('currentDataKeys')));
            element['href'] = Navigation.historyManager.getHref(link);
            element.setAttribute('data-state-context-url', Navigation.StateContext.url);
        }
    }

    function getData(toData, includeCurrentData, currentDataKeys) {
        var data = {};
        toData = ko.unwrap(toData);
        for (var key in toData) {
            data[key] = ko.unwrap(toData[key]);
        }
        includeCurrentData = ko.unwrap(includeCurrentData);
        currentDataKeys = ko.unwrap(currentDataKeys);
        if (currentDataKeys)
            data = Navigation.StateContext.includeCurrentData(data, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            data = Navigation.StateContext.includeCurrentData(data);
        return data;
    }

    function addClickListener(element: HTMLAnchorElement) {
        var navigate = (e: MouseEvent) => {
            if (!e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                Navigation.StateController.navigateLink(Navigation.historyManager.getUrl(element));
            }
        }
        if (window.addEventListener)
            element.addEventListener('click', navigate);
        else
            element.attachEvent('click', navigate);
    }
}