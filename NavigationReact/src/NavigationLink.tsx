import LinkUtility from './LinkUtility';
import withStateNavigator from './withStateNavigator';
import { StateNavigator } from 'navigation';
import { NavigationLinkProps } from './Props';
import * as React from 'react';
type NavigationLinkState = { link?: string, active?: boolean, crumb?: number };

class NavigationLink extends React.Component<NavigationLinkProps, NavigationLinkState> {
    constructor(props, context) {
        super(props, context);
        this.state = { crumb: props.stateNavigator.stateContext.crumbs.length };
    }

    static getDerivedStateFromProps({ acrossCrumbs, stateKey, navigationData, includeCurrentData, currentDataKeys, stateNavigator }, { crumb }): NavigationLinkState {
        var { crumbs, state } = stateNavigator.stateContext;
        if (!acrossCrumbs && crumb !== crumbs.length)
            return null;
        try {
            var link = stateNavigator.getNavigationLink(stateKey, LinkUtility.getData(stateNavigator, navigationData, includeCurrentData, currentDataKeys));
        } catch {}
        return { link, active: state && state.key === stateKey && LinkUtility.isActive(stateNavigator, navigationData) };
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
export default withStateNavigator(NavigationLink);
