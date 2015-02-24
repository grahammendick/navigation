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
            element['href'] = '#' + Navigation.StateController.getNavigationLink(action, data);
            element.removeEventListener('click', navigate);
            element.addEventListener('click', navigate);
        }
    };
}