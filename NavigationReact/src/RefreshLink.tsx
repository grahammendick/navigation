'use client'
import LinkUtility from './LinkUtility';
import withStateNavigator from './withStateNavigator';
import { RefreshLinkProps } from './Props';

var RefreshLink = (props: RefreshLinkProps) => {
    var htmlProps = LinkUtility.toHtmlProps(props);
    var { navigationData, includeCurrentData, currentDataKeys, hash, stateNavigator } = props;
    navigationData = LinkUtility.getData(stateNavigator, navigationData, includeCurrentData, currentDataKeys);
    try {
        var link = stateNavigator.getRefreshLink(navigationData, hash);
    } catch {}
    htmlProps.href = link && stateNavigator.historyManager.getHref(link);
    htmlProps.onClick = link && LinkUtility.getOnClick(stateNavigator, props, link);
    var active = LinkUtility.isActive(stateNavigator, navigationData);
    LinkUtility.setActive(active, props, htmlProps);
    return <a {...htmlProps} />;
}
export default withStateNavigator(RefreshLink);
