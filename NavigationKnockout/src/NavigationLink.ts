import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import ko = require('knockout');

var NavigationLink = ko.bindingHandlers['navigationLink'] = {
    init: (element, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor) => {
        LinkUtility.addListeners(element, () => setNavigationLink(element, valueAccessor, allBindings), !!allBindings.get('lazy'));
    },
    update: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
        setNavigationLink(element, valueAccessor, allBindings);
    }
};

function setNavigationLink(element: HTMLAnchorElement, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor) {
    var data = {};
    var toData = ko.unwrap(allBindings.get('toData'));
    toData = ko.unwrap(toData);
    for (var key in toData) {
        data[key] = ko.unwrap(toData[key]);
    }
    LinkUtility.setLink(element, () => Navigation.StateController.getNavigationLink(ko.unwrap(valueAccessor()),
        LinkUtility.getData(data, ko.unwrap(allBindings.get('includeCurrentData')), ko.unwrap(allBindings.get('currentDataKeys'))))
    );
}
export = NavigationLink;
