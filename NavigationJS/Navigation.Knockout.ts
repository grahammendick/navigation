module NavigationKnockout {
    ko.bindingHandlers['navigationLink'] = {
        update: (element: Element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
            var action = ko.utils.unwrapObservable<string>(valueAccessor());
            var dataValue = allBindings.get('toData');
            var includeCurrentData: boolean = allBindings.get('includeCurrentData');
            var currentDataKeys: string = allBindings.get('currentDataKeys');
            var navigate = (e) => {
                if (!e.ctrlKey && !e.shiftKey) {
                    e.preventDefault();
                    Navigation.StateController.navigate(action, getData(dataValue, includeCurrentData, currentDataKeys));
                }
            }
            var link = Navigation.StateController.getNavigationLink(action, getData(dataValue, includeCurrentData, currentDataKeys));
            element['href'] = Navigation.historyManager.getHref(link);
            element.removeEventListener('click', navigate);
            element.addEventListener('click', navigate);
        }
    };

    ko.bindingHandlers['navigationBackLink'] = {
        update: (element: Element, valueAccessor) => {
            var distance = ko.utils.unwrapObservable<number>(valueAccessor());
            var navigate = (e) => {
                if (!e.ctrlKey && !e.shiftKey) {
                    e.preventDefault();
                    Navigation.StateController.navigateBack(distance);
                }
            }
            var link = Navigation.StateController.getNavigationBackLink(distance);
            element['href'] = Navigation.historyManager.getHref(link);
            element.removeEventListener('click', navigate);
            element.addEventListener('click', navigate);
        }
    };

    ko.bindingHandlers['refreshLink'] = {
        update: (element: Element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
            var dataValue = ko.utils.unwrapObservable<any>(valueAccessor());
            var includeCurrentData: boolean = allBindings.get('includeCurrentData');
            var currentDataKeys: string = allBindings.get('currentDataKeys');
            var navigate = (e) => {
                if (!e.ctrlKey && !e.shiftKey) {
                    e.preventDefault();
                    Navigation.StateController.refresh(getData(dataValue, includeCurrentData, currentDataKeys));
                }
            }
            var link = Navigation.StateController.getRefreshLink(getData(dataValue, includeCurrentData, currentDataKeys));
            element['href'] = Navigation.historyManager.getHref(link);
            element.removeEventListener('click', navigate);
            element.addEventListener('click', navigate);
        }
    };

    function getData(dataValue: any, includeCurrentData: boolean, currentDataKeys: string) {
        var data = {};
        if (currentDataKeys)
            data = Navigation.StateContext.newCurrentData(currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            data = Navigation.StateContext.newCurrentData();
        for (var key in dataValue) {
            data[key] = ko.utils.unwrapObservable(dataValue[key]);
        }
        return data;
    }
}