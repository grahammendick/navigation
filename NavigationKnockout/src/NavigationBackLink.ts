import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import ko = require('knockout');

var NavigationBackLink = ko.bindingHandlers['navigationBackLink'] = {
    init: (element, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor, viewModel: any) => {
        LinkUtility.addListeners(element, () => setNavigationBackLink(element, valueAccessor, allBindings), allBindings, viewModel);
    },
    update: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
        setNavigationBackLink(element, valueAccessor, allBindings);
    }
};

function setNavigationBackLink(element: HTMLAnchorElement, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor) {
    var stateController: Navigation.StateController = allBindings.get('stateController');
    LinkUtility.setLink(stateController, element, () => stateController.getNavigationBackLink(ko.unwrap(valueAccessor())));
}
export = NavigationBackLink;
