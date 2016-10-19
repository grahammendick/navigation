import LinkUtility from './LinkUtility';
import { StateNavigator } from 'navigation';
import * as CycleDOM from '@cycle/dom';

var NavigationBackLink = (stateNavigator: StateNavigator, properties: any, children: any) => {
    var newProperties: any = {};
    for(var key in properties)
        newProperties[key] = properties[key];
    try {
        var link = stateNavigator.getNavigationBackLink(properties.distance)
        newProperties.href = stateNavigator.historyManager.getHref(link);
    } catch(e) {
    }
    LinkUtility.setHistoryAction(newProperties, properties.historyAction);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
}
export default NavigationBackLink;
