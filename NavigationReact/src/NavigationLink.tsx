import LinkUtility from './LinkUtility';
import withStateNavigator from './withStateNavigator';
import { StateNavigator } from 'navigation';
import { NavigationLinkProps } from './Props';
import * as React from 'react';
type NavigationLinkState = { link: string, active: boolean, crumb: number };

class NavigationLink extends React.Component<NavigationLinkProps, NavigationLinkState> {
    constructor(props, context) {
        super(props, context);
        var { stateNavigator } = props;
        var { crumbs } = stateNavigator.stateContext;
        this.state = {
            link: null,
            active: false,
            crumb: crumbs.length
        }
    }

    static getDerivedStateFromProps(props, { crumb }) {
        var { acrossCrumbs, navigationData, stateKey, stateNavigator } = props;
        var { crumbs, state } = stateNavigator.stateContext;
        if (!acrossCrumbs && crumb !== undefined && crumb !== crumbs.length)
            return null;
        return {
            link: NavigationLink.getNavigationLink(props),
            active: state && state.key === stateKey && LinkUtility.isActive(stateNavigator, navigationData)
        };
    }

    private static getNavigationLink({ stateKey, navigationData, includeCurrentData, currentDataKeys, stateNavigator }): string {
        var navigationData = LinkUtility.getData(stateNavigator, navigationData, includeCurrentData, currentDataKeys);
        try {
            return stateNavigator.getNavigationLink(stateKey, navigationData);
        } catch (e) {
            return null;
        }
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
