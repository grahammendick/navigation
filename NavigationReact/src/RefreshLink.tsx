import LinkUtility from './LinkUtility';
import withStateNavigator from './withStateNavigator';
import { RefreshLinkProps } from './Props';
import * as React from 'react';
type RefreshLinkState = { link?: string, active?: boolean, crumb?: number };

class RefreshLink extends React.Component<RefreshLinkProps, RefreshLinkState> {
    constructor(props) {
        super(props);
        this.state = { crumb: props.stateNavigator.stateContext.crumbs.length };
    }

    static getDerivedStateFromProps(props, { crumb }): RefreshLinkState {
        var { acrossCrumbs, navigationData, includeCurrentData, currentDataKeys, stateNavigator } = props;
        var { crumbs, state } = stateNavigator.stateContext;
        if (!acrossCrumbs && crumb !== crumbs.length)
            return null;
        navigationData = LinkUtility.getData(stateNavigator, navigationData, includeCurrentData, currentDataKeys);
        try {
            var link = stateNavigator.getRefreshLink(navigationData);
        } catch {}
        return { link, active: LinkUtility.isActive(stateNavigator, navigationData) };
    }
    
    render() {
        var props: any = {};
        for(var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        props.href = this.state.link && this.props.stateNavigator.historyManager.getHref(this.state.link);
        props.onClick = LinkUtility.getOnClick(this.props.stateNavigator, this.props, this.state.link);
        LinkUtility.setActive(this.state.active, this.props, props);
        return <a {...props}>{this.props.children}</a>;
    }
};
export default withStateNavigator(RefreshLink);
