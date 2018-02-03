import LinkUtility from './LinkUtility';
import withStateNavigator from './withStateNavigator';
import { StateNavigator } from 'navigation';
import { RefreshLinkProps } from './Props';
import * as React from 'react';
type RefreshLinkState = { link: string, active: boolean };

class RefreshLink extends React.Component<RefreshLinkProps, RefreshLinkState> {
    private crumb: number;
    private onNavigate = () => {
        var { link, active } = this.state;
        var componentState = this.getComponentState();
        if (link !== componentState.link || active !== componentState.active)
            this.setState(componentState);
    }

    constructor(props, context) {
        super(props, context);
        this.state = this.getComponentState(props);
        this.crumb = this.getStateNavigator().stateContext.crumbs.length;
    }

    static contextTypes = {
        stateNavigator: () => {}
    }
    
    private getStateNavigator(): StateNavigator {
        return this.props.stateNavigator || (<any> this.context).stateNavigator;
    }
    
    componentDidMount() {
        if (!this.props.navigationContext)
            this.getStateNavigator().onNavigate(this.onNavigate);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.getComponentState(nextProps))
    }

    componentWillUnmount() {
        if (!this.props.navigationContext)
            this.getStateNavigator().offNavigate(this.onNavigate);
    }
    
    private getComponentState(props = this.props): RefreshLinkState {
        var { crumbs } = this.getStateNavigator().stateContext;
        var { acrossCrumbs, navigationData } = props;
        if (!acrossCrumbs && this.crumb !== undefined && this.crumb !== crumbs.length)
            return this.state;
        var link = this.getRefreshLink(props);
        var active = LinkUtility.isActive(this.getStateNavigator(), navigationData);
        return { link, active };
    }

    private getRefreshLink(props): string {
        var { navigationData, includeCurrentData, currentDataKeys } = props;
        var navigationData = LinkUtility.getData(this.getStateNavigator(), navigationData, includeCurrentData, currentDataKeys);
        try {
            return this.getStateNavigator().getRefreshLink(navigationData);
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
        props.href = this.state.link && this.getStateNavigator().historyManager.getHref(this.state.link);
        props.onClick = LinkUtility.getOnClick(this.getStateNavigator(), this.props, this.state.link);
        LinkUtility.setActive(this.state.active, this.props, props);
        return React.createElement('a', props, this.props.children);
    }
};
export default withStateNavigator(RefreshLink);
