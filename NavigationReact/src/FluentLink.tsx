'use client'
import LinkUtility from './LinkUtility';
import withStateNavigator from './withStateNavigator';
import { FluentLinkProps } from './Props';

var FluentLink = (props: FluentLinkProps) => {
    var htmlProps = LinkUtility.toHtmlProps(props);
    var { withContext = false, navigate, stateNavigator } = props;
    try {
        var link = navigate(stateNavigator.fluent(withContext)).url;
    } catch {}
    htmlProps.href = link && stateNavigator.historyManager.getHref(link);
    htmlProps.onClick = link && LinkUtility.getOnClick(stateNavigator, props, link);
    return <a {...htmlProps} />;
}
export default withStateNavigator(FluentLink);
