import LinkUtility = require('./LinkUtility');
import Navigation = require('../Navigation');

ko.bindingHandlers['refreshLink'] = {
    init: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
        LinkUtility.addClickListener(element);
        LinkUtility.addNavigateHandler(element, () => setRefreshLink(element, valueAccessor, allBindings));
    },
    update: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
        element.removeAttribute('data-state-context-url');
        setRefreshLink(element, valueAccessor, allBindings);
    }
};

function setRefreshLink(element: HTMLAnchorElement, valueAccessor, allBindings: KnockoutAllBindingsAccessor) {
    LinkUtility.setLink(element, () => Navigation.StateController.getRefreshLink(
        LinkUtility.getData(valueAccessor(), allBindings.get('includeCurrentData'), allBindings.get('currentDataKeys')))
    );
}
 