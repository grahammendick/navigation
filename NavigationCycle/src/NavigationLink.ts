import LinkUtility from './LinkUtility';
import * as Navigation from 'navigation';
import * as CycleDOM from '@cycle/dom';

var NavigationLink = (stateNavigator: Navigation.StateNavigator, properties: any, children: any) => {
    var newProperties: any = {};
    for(var key in properties)
        newProperties[key] = properties[key];
    var navigationData = LinkUtility.getData(stateNavigator, properties.navigationData, properties.includeCurrentData, properties.currentDataKeys);
    try {
        var link = stateNavigator.getNavigationLink(properties.stateKey, navigationData);
        newProperties.href = stateNavigator.historyManager.getHref(link);
    } catch(e) {
    }
    if (stateNavigator.stateContext.state && stateNavigator.stateContext.state.key === properties.stateKey)
        LinkUtility.setActive(stateNavigator, properties, newProperties);
    LinkUtility.setHistoryAction(newProperties, properties.historyAction);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
}
export default NavigationLink;
