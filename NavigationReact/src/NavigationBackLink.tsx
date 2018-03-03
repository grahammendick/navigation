import LinkUtility from './LinkUtility';
import withStateNavigator from './withStateNavigator';
import { NavigationBackLinkProps } from './Props';
import * as React from 'react';
type NavigationBackLinkState = { link?: string, crumb?: number };

class NavigationBackLink extends React.Component<NavigationBackLinkProps, NavigationBackLinkState> {
    constructor(props) {
        super(props);
        this.state = { crumb: props.stateNavigator.stateContext.crumbs.length };
    }

    static getDerivedStateFromProps(props, { crumb }) {
        var { acrossCrumbs, distance, stateNavigator } = props;
        var { crumbs, state } = stateNavigator.stateContext;
        if (!acrossCrumbs && crumb !== crumbs.length)
            return null;
        try {
            var link = stateNavigator.getNavigationBackLink(distance);
        } catch {}
        return { link };
    }

    render() {
        var props: any = {};
        for(var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        props.href = this.state.link && this.props.stateNavigator.historyManager.getHref(this.state.link);
        props.onClick = LinkUtility.getOnClick(this.props.stateNavigator, this.props, this.state.link);
        return <a {...props}>{this.props.children}</a>;
    }
};
export default withStateNavigator(NavigationBackLink);
