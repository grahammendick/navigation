module Navigation.Knockout {
    ko.bindingHandlers['navigationLink'] = {
        init: (element: Element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
            var navigate = (e) => {
                if (!e.ctrlKey && !e.shiftKey) {
                    e.preventDefault();
                    Navigation.StateController.navigate(ko.unwrap(valueAccessor()),
                        getData(allBindings.get('toData'), allBindings.get('includeCurrentData'), allBindings.get('currentDataKeys')));
                }
            }
            element.addEventListener('click', navigate);
        },
        update: (element: Element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
            var link = Navigation.StateController.getNavigationLink(ko.unwrap(valueAccessor()),
                getData(allBindings.get('toData'), allBindings.get('includeCurrentData'), allBindings.get('currentDataKeys')));
            element['href'] = Navigation.historyManager.getHref(link);
        }
    };

    ko.bindingHandlers['navigationBackLink'] = {
        init: (element: Element, valueAccessor) => {
            var navigate = (e) => {
                if (!e.ctrlKey && !e.shiftKey) {
                    e.preventDefault();
                    Navigation.StateController.navigateBack(ko.unwrap(valueAccessor()));
                }
            }
            element.addEventListener('click', navigate);
        },
        update: (element: Element, valueAccessor) => {
            var link = Navigation.StateController.getNavigationBackLink(ko.unwrap(valueAccessor()));
            element['href'] = Navigation.historyManager.getHref(link);
        }
    };

    ko.bindingHandlers['refreshLink'] = {
        init: (element: Element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
            var navigate = (e) => {
                if (!e.ctrlKey && !e.shiftKey) {
                    e.preventDefault();
                    Navigation.StateController.refresh(
                        getData(valueAccessor(), allBindings.get('includeCurrentData'), allBindings.get('currentDataKeys')));
                }
            }
            element.addEventListener('click', navigate);
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
        includeCurrentData = ko.unwrap(includeCurrentData);
        currentDataKeys = ko.unwrap(currentDataKeys);
        if (currentDataKeys)
            data = Navigation.StateContext.newCurrentData(currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            data = Navigation.StateContext.newCurrentData();
        for (var key in toData) {
            data[key] = ko.unwrap(toData[key]);
        }
        return data;
    }
}