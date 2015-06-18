import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import ko = require('knockout');

var NavigationBackLink = ko.bindingHandlers['navigationBackLink'] = {
    init: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
        LinkUtility.addClickListener(element, () => setNavigationBackLink(element, valueAccessor));
        LinkUtility.addNavigateHandler(element, () => {
            if (!allBindings.get('lazy'))
                setNavigationBackLink(element, valueAccessor);
        });
    },
    update: (element, valueAccessor) => {
        setNavigationBackLink(element, valueAccessor);
    }
};

function setNavigationBackLink(element: HTMLAnchorElement, valueAccessor) {
    LinkUtility.setLink(element, () => Navigation.StateController.getNavigationBackLink(ko.unwrap(valueAccessor())));
}
export = NavigationBackLink;
