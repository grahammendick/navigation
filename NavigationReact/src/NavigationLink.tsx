import LinkUtility from './LinkUtility';
import withStateNavigator from './withStateNavigator';
import { StateNavigator } from 'navigation';
import { NavigationLinkProps } from './Props';
import * as React from 'react';
type NavigationLinkState = { link?: string, active?: boolean, crumb?: number };

class NavigationLink extends React.Component<NavigationLinkProps, NavigationLinkState> {
    constructor(props) {
        super(props);
        this.state = { crumb: props.stateNavigator.stateContext.crumbs.length };
    }

    static getDerivedStateFromProps(props, { crumb }): NavigationLinkState {
        var { acrossCrumbs, stateKey, navigationData, includeCurrentData, currentDataKeys, stateNavigator } = props;
        var { crumbs, state } = stateNavigator.stateContext;
        if (!acrossCrumbs && crumb !== crumbs.length)
            return null;
        navigationData = LinkUtility.getData(stateNavigator, navigationData, includeCurrentData, currentDataKeys);
        try {
            var link = stateNavigator.getNavigationLink(stateKey, navigationData);
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
