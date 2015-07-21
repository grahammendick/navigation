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
    var action = ko.unwrap(valueAccessor());
    var data = {};
    var toData = ko.unwrap(allBindings.get('toData'));
    var nextState = Navigation.StateController.getNextState(action);
    var active = nextState === nextState.parent.initial && nextState.parent === Navigation.StateContext.dialog;
    for (var key in toData) {
        var val = ko.unwrap(toData[key]);
        data[key] = val;
        active = active && LinkUtility.isActive(key, val);
    }
    LinkUtility.setLink(element, () => Navigation.StateController.getNavigationLink(action,
        LinkUtility.getData(data, ko.unwrap(allBindings.get('includeCurrentData')), ko.unwrap(allBindings.get('currentDataKeys'))))
    );
}
export = NavigationLink;
