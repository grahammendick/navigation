import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import ko = require('knockout');

var RefreshLink = ko.bindingHandlers['refreshLink'] = {
    init: (element, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor) => {
        LinkUtility.addListeners(element, () => setRefreshLink(element, valueAccessor, allBindings), !!allBindings.get('lazy'));
    },
    update: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
        setRefreshLink(element, valueAccessor, allBindings);
    }
};

function setRefreshLink(element: HTMLAnchorElement, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor) {
    var data = {};
    var toData = ko.unwrap(valueAccessor());
    var active = true;
    for (var key in toData) {
        var val = ko.unwrap(toData[key]);
        data[key] = val;
        active = active && LinkUtility.isActive(key, val);
    }
    LinkUtility.setLink(element, () => Navigation.StateController.getRefreshLink(
        LinkUtility.getData(data, ko.unwrap(allBindings.get('includeCurrentData')), ko.unwrap(allBindings.get('currentDataKeys'))))
    );
    active = active && !!element.href;
    LinkUtility.setActive(element, active, ko.unwrap(allBindings.get('activeCssClass')), ko.unwrap(allBindings.get('disableActive')));
}
export = RefreshLink;
