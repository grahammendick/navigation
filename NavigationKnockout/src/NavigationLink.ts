import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import ko = require('knockout');

var NavigationLink = ko.bindingHandlers['navigationLink'] = {
    init: (element, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor, viewModel: any) => {
        LinkUtility.addListeners(element, () => setNavigationLink(element, valueAccessor, allBindings), allBindings, viewModel);
    },
    update: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
        setNavigationLink(element, valueAccessor, allBindings);
    }
};

function setNavigationLink(element: HTMLAnchorElement, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor) {
    var stateKey = ko.unwrap(valueAccessor());
    var data = {};
    var navigationData = ko.unwrap(allBindings.get('navigationData'));
    var stateNavigator: Navigation.StateNavigator = allBindings.get('stateNavigator');
    for (var key in navigationData) {
        data[key] = ko.unwrap(navigationData[key]);
    }
    LinkUtility.setLink(stateNavigator, element, () => stateNavigator.getNavigationLink(stateKey,
        LinkUtility.getData(stateNavigator, data, ko.unwrap(allBindings.get('includeCurrentData')), ko.unwrap(allBindings.get('currentDataKeys'))))
    );
    if (stateNavigator.stateContext.state && stateNavigator.stateContext.state.key === stateKey)
        LinkUtility.setActive(element, stateNavigator, data, allBindings);
}
export = NavigationLink;
