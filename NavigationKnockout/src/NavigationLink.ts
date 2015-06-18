import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import ko = require('knockout');

var NavigationLink = ko.bindingHandlers['navigationLink'] = {
    init: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
        LinkUtility.addClickListener(element, () => setNavigationLink(element, valueAccessor, allBindings));
        LinkUtility.addNavigateHandler(element, () => {
            if (!allBindings.get('lazy'))
                setNavigationLink(element, valueAccessor, allBindings);
        });
    },
    update: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
        setNavigationLink(element, valueAccessor, allBindings);
    }
};

function setNavigationLink(element: HTMLAnchorElement, valueAccessor, allBindings: KnockoutAllBindingsAccessor) {
    LinkUtility.setLink(element, () => Navigation.StateController.getNavigationLink(ko.unwrap(valueAccessor()),
        LinkUtility.getData(allBindings.get('toData'), allBindings.get('includeCurrentData'), allBindings.get('currentDataKeys')))
    );
}
export = NavigationLink;
