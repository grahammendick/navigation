import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import ko = require('knockout');

var RefreshLink = ko.bindingHandlers['refreshLink'] = {
    init: (element, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor) => {
        LinkUtility.addClickListener(element, () => setRefreshLink(element, valueAccessor, allBindings));
        LinkUtility.addNavigateHandler(element, () => {
            if (!allBindings.get('lazy'))
                setRefreshLink(element, valueAccessor, allBindings);
        });
    },
    update: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
        setRefreshLink(element, valueAccessor, allBindings);
    }
};

function setRefreshLink(element: HTMLAnchorElement, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor) {
    LinkUtility.setLink(element, () => Navigation.StateController.getRefreshLink(
        LinkUtility.getData(valueAccessor(), allBindings.get('includeCurrentData'), allBindings.get('currentDataKeys')))
    );
}
export = RefreshLink;
