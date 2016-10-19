import LinkUtility from './LinkUtility';
import { StateNavigator } from 'navigation';
import * as angular from 'angular';

var NavigationLink = ($parse: ng.IParseService) => {
    return {
        restrict: 'EA',
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            var stateKey, navigationData, includeCurrentData, currentDataKeys, activeCssClass, disableActive;
            var stateNavigator: StateNavigator = scope.$eval(attrs['stateNavigator']);
            LinkUtility.addListeners(element, () => setNavigationLink(element, attrs, stateNavigator, stateKey, navigationData,
                includeCurrentData, currentDataKeys, activeCssClass, disableActive), $parse, attrs, scope)
            var watchAttrs = [attrs['navigationLink'], attrs['navigationData'], attrs['includeCurrentData'], 
                attrs['currentDataKeys'], attrs['activeCssClass'], attrs['disableActive']];
            scope.$watchGroup(watchAttrs, function (values) {
                stateKey = values[0];
                navigationData = values[1];
                includeCurrentData = values[2];
                currentDataKeys = values[3];
                activeCssClass = values[4];
                disableActive = values[5];
                setNavigationLink(element, attrs, stateNavigator, stateKey, navigationData, includeCurrentData, currentDataKeys, activeCssClass, disableActive);
            });
        }
    }
};

function setNavigationLink(element: ng.IAugmentedJQuery, attrs: ng.IAttributes, stateNavigator: StateNavigator,
    stateKey: string, navigationData: any, includeCurrentData: boolean, currentDataKeys: string, activeCssClass: string, disableActive: boolean) {
    LinkUtility.setLink(stateNavigator, element, attrs, () => stateNavigator.getNavigationLink(stateKey,
        LinkUtility.getData(stateNavigator, navigationData, includeCurrentData, currentDataKeys))
    );
    if (stateNavigator.stateContext.state && stateNavigator.stateContext.state.key === stateKey)
        LinkUtility.setActive(element, stateNavigator, attrs, navigationData, activeCssClass, disableActive);
}
export default NavigationLink;
