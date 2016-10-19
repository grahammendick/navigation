import LinkUtility from './LinkUtility';
import { StateNavigator } from 'navigation';
import * as ko from 'knockout';

var NavigationBackLink = ko.bindingHandlers['navigationBackLink'] = {
    init: (element, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor, viewModel: any) => {
        LinkUtility.addListeners(element, () => setNavigationBackLink(element, valueAccessor, allBindings), allBindings, viewModel);
    },
    update: (element, valueAccessor, allBindings: KnockoutAllBindingsAccessor) => {
        setNavigationBackLink(element, valueAccessor, allBindings);
    }
};

function setNavigationBackLink(element: HTMLAnchorElement, valueAccessor: () => any, allBindings: KnockoutAllBindingsAccessor) {
    var stateNavigator: StateNavigator = allBindings.get('stateNavigator');
    LinkUtility.setLink(stateNavigator, element, () => stateNavigator.getNavigationBackLink(ko.unwrap(valueAccessor())));
}
export default NavigationBackLink;
