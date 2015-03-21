module Navigation.Knockout {
    ko.bindingHandlers['navigationLink'] = {
        init: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
            addClickListener(element);
            addNavigateHandler(element, () => setNavigationLink(element, valueAccessor, allBindings));
        },
        update: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
            element.removeAttribute('data-state-context-url');
            setNavigationLink(element, valueAccessor, allBindings);
        }
    };

    function setNavigationLink(element: HTMLAnchorElement, valueAccessor, allBindings: KnockoutAllBindingsAccessor) {
        setLink(element, () => Navigation.StateController.getNavigationLink(ko.unwrap(valueAccessor()),
            getData(allBindings.get('toData'), allBindings.get('includeCurrentData'), allBindings.get('currentDataKeys')))
            );
    }

    ko.bindingHandlers['navigationBackLink'] = {
        init: (element, valueAccessor) => {
            addClickListener(element);
            addNavigateHandler(element, () => setNavigationBackLink(element, valueAccessor));
        },
        update: (element, valueAccessor) => {
            element.removeAttribute('data-state-context-url');
            setNavigationBackLink(element, valueAccessor);
        }
    };

    function setNavigationBackLink(element: HTMLAnchorElement, valueAccessor) {
        setLink(element, () => Navigation.StateController.getNavigationBackLink(ko.unwrap(valueAccessor())));
    }

    ko.bindingHandlers['refreshLink'] = {
        init: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
            addClickListener(element);
            addNavigateHandler(element, () => setRefreshLink(element, valueAccessor, allBindings));
        },
        update: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
            element.removeAttribute('data-state-context-url');
            setRefreshLink(element, valueAccessor, allBindings);
        }
    };

    function setRefreshLink(element: HTMLAnchorElement, valueAccessor, allBindings: KnockoutAllBindingsAccessor) {
        setLink(element, () => Navigation.StateController.getRefreshLink(
            getData(valueAccessor(), allBindings.get('includeCurrentData'), allBindings.get('currentDataKeys')))
            );
    }

    function setLink(element: HTMLAnchorElement, linkAccessor: () => string) {
        if (element.getAttribute('data-state-context-url') !== Navigation.StateContext.url) {
            element.href = Navigation.historyManager.getHref(linkAccessor());
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

    function addNavigateHandler(element, handler) {
        Navigation.StateController.onNavigate(handler);
        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            Navigation.StateController.offNavigate(handler);
        });
    }
}