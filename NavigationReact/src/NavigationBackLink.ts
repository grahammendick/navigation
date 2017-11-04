import LinkUtility from './LinkUtility';
import { StateNavigator } from 'navigation';
import { NavigationBackLinkProps } from './Props';
import * as React from 'react';
type NavigationBackLinkState = { link: string };

class NavigationBackLink extends React.Component<NavigationBackLinkProps, NavigationBackLinkState> {
    private crumb: number;
    private onNavigate = () => {
        var componentState = this.getComponentState(this.props);
        if (this.state.link !== componentState.link)
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
        this.getStateNavigator().onNavigate(this.onNavigate);
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState(this.getComponentState(nextProps))
    }
    componentWillUnmount() {
        this.getStateNavigator().offNavigate(this.onNavigate);
    }
    
    getComponentState(props): NavigationBackLinkState {
        var { crumbs } = this.getStateNavigator().stateContext;
        if (!props.acrossCrumbs && this.crumb !== undefined && this.crumb !== crumbs.length)
            return this.state;
        var { distance } = props;
        var canNavigateBack = this.getStateNavigator().canNavigateBack(distance);
        var link = canNavigateBack ? this.getStateNavigator().getNavigationBackLink(distance) : null;
        return { link };
    }

    render() {
        var props: any = {};
        for(var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        props.href = this.state.link && this.getStateNavigator().historyManager.getHref(this.state.link);
        props.onClick = LinkUtility.getOnClick(this.getStateNavigator(), this.props, this.state.link);
        return React.createElement('a', props, this.props.children);
    }
};
export default NavigationBackLink;
