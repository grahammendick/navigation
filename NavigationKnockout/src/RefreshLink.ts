import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import ko = require('knockout');

var RefreshLink = ko.bindingHandlers['refreshLink'] = {
    init: (element, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor, viewModel: any) => {
        LinkUtility.addListeners(element, () => setRefreshLink(element, valueAccessor, allBindings), allBindings, viewModel);
    },
    update: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
        setRefreshLink(element, valueAccessor, allBindings);
    }
};

function setRefreshLink(element: HTMLAnchorElement, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor) {
    var data = {};
    var toData = ko.unwrap(valueAccessor());
    var active = true;
    var stateController: Navigation.StateController = allBindings.get('stateController');
    for (var key in toData) {
        var val = ko.unwrap(toData[key]);
        data[key] = val;
        active = active && LinkUtility.isActive(stateController, key, val);
    }
    LinkUtility.setLink(stateController, element, () => stateController.getRefreshLink(
        LinkUtility.getData(stateController, data, ko.unwrap(allBindings.get('includeCurrentData')), ko.unwrap(allBindings.get('currentDataKeys'))))
    );
    active = active && !!element.href;
    LinkUtility.setActive(element, active, ko.unwrap(allBindings.get('activeCssClass')), ko.unwrap(allBindings.get('disableActive')));
}
export = RefreshLink;
