import LinkUtility = require('./LinkUtility');
import Navigation = require('../Navigation');

var NavigationBackLink = ko.bindingHandlers['navigationBackLink'] = {
    init: (element, valueAccessor) => {
        LinkUtility.addClickListener(element);
        LinkUtility.addNavigateHandler(element, () => setNavigationBackLink(element, valueAccessor));
    },
    update: (element, valueAccessor) => {
        element.removeAttribute('data-state-context-url');
        setNavigationBackLink(element, valueAccessor);
    }
};

function setNavigationBackLink(element: HTMLAnchorElement, valueAccessor) {
    LinkUtility.setLink(element, () => Navigation.StateController.getNavigationBackLink(ko.unwrap(valueAccessor())));
}
export = NavigationBackLink;
