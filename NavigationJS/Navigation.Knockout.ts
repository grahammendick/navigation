module NavigationKnockout {
    ko.bindingHandlers['navigationLink'] = {
        update: (element: Element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
            var action = ko.utils.unwrapObservable<string>(valueAccessor());
            var dataValue = allBindings.get('toData');
            var data = {};
            for (var key in dataValue) {
                data[key] = ko.utils.unwrapObservable(dataValue[key]);
            } 
            var navigate = (e) => {
                if (!e.ctrlKey && !e.shiftKey) {
                    e.preventDefault();
                    Navigation.StateController.navigate(action, data);
                }
            }
            var link = Navigation.StateController.getNavigationLink(action, data);
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
}