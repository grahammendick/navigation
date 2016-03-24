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
    var active = true;
    var stateNavigator: Navigation.StateNavigator = allBindings.get('stateNavigator');
    for (var key in navigationData) {
        var val = ko.unwrap(navigationData[key]);
        data[key] = val;
        active = active && LinkUtility.isActive(stateNavigator, key, val);
    }
    LinkUtility.setLink(stateNavigator, element, () => stateNavigator.getNavigationLink(stateKey,
        LinkUtility.getData(stateNavigator, data, ko.unwrap(allBindings.get('includeCurrentData')), ko.unwrap(allBindings.get('currentDataKeys'))))
    );
    active = active && !!element.href && stateNavigator.stateContext.state && stateNavigator.stateContext.state.key === stateKey;
    LinkUtility.setActive(element, active, ko.unwrap(allBindings.get('activeCssClass')), ko.unwrap(allBindings.get('disableActive')));
}
export = NavigationLink;
