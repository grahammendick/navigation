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
    var action = ko.unwrap(valueAccessor());
    var data = {};
    var toData = ko.unwrap(allBindings.get('toData'));
    var active = true;
    var stateController: Navigation.StateController = allBindings.get('stateController');
    for (var key in toData) {
        var val = ko.unwrap(toData[key]);
        data[key] = val;
        active = active && LinkUtility.isActive(stateController, key, val);
    }
    LinkUtility.setLink(stateController, element, () => stateController.getNavigationLink(action,
        LinkUtility.getData(stateController, data, ko.unwrap(allBindings.get('includeCurrentData')), ko.unwrap(allBindings.get('currentDataKeys'))))
    );
    active = active && !!element.href && isActive(stateController, action);
    LinkUtility.setActive(element, active, ko.unwrap(allBindings.get('activeCssClass')), ko.unwrap(allBindings.get('disableActive')));
}

function isActive(stateController: Navigation.StateController, action: string): boolean {
    var nextState = stateController.getNextState(action);
    return nextState === nextState.parent.initial && nextState.parent === stateController.stateContext.dialog;
}
export = NavigationLink;
