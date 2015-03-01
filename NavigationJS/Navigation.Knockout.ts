module Navigation.Knockout {
    ko.bindingHandlers['navigationLink'] = {
        init: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
            addClickListener(element, () => {
                Navigation.StateController.navigate(ko.unwrap(valueAccessor()),
                    getData(allBindings.get('toData'), allBindings.get('includeCurrentData'), allBindings.get('currentDataKeys')));
            });
        },
        update: (element: Element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
            var link = Navigation.StateController.getNavigationLink(ko.unwrap(valueAccessor()),
                getData(allBindings.get('toData'), allBindings.get('includeCurrentData'), allBindings.get('currentDataKeys')));
            element['href'] = Navigation.historyManager.getHref(link);
        }
    };

    ko.bindingHandlers['navigationBackLink'] = {
        init: (element, valueAccessor) => {
            addClickListener(element, () => {
                Navigation.StateController.navigateBack(ko.unwrap(valueAccessor()));
            });
        },
        update: (element: Element, valueAccessor) => {
            var link = Navigation.StateController.getNavigationBackLink(ko.unwrap(valueAccessor()));
            element['href'] = Navigation.historyManager.getHref(link);
        }
    };

    ko.bindingHandlers['refreshLink'] = {
        init: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
            addClickListener(element, () => {
                Navigation.StateController.refresh(
                    getData(valueAccessor(), allBindings.get('includeCurrentData'), allBindings.get('currentDataKeys')));
            });
        },
        update: (element: Element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
            var link = Navigation.StateController.getRefreshLink(
                getData(valueAccessor(), allBindings.get('includeCurrentData'), allBindings.get('currentDataKeys')));
            element['href'] = Navigation.historyManager.getHref(link);
        }
    };

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

    function addClickListener(element, listener: () => void) {
        var navigate = (e: MouseEvent) => {
            if (!e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                listener();
            }
        }
        if (window.addEventListener)
            element.addEventListener('click', navigate);
        else
            element.attachEvent('click', navigate);
    }
}