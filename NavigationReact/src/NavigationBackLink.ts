import LinkUtility from './LinkUtility';
import { StateNavigator } from 'navigation';
import { NavigationBackLinkProps } from './Props';
import * as React from 'react';
type NavigationBackLinkState = { link: string };

class NavigationBackLink extends React.Component<NavigationBackLinkProps, NavigationBackLinkState> {
    private onNavigate = () => {
        var componentState = this.getComponentState();
        if (this.state.link !== componentState.link)
            this.setState(componentState);
    }

    constructor(props, context) {
        super(props, context);
        this.state = this.getComponentState(props);
    }

    static contextTypes = {
        stateNavigator: () => {}
    }
    
    private getStateNavigator(): StateNavigator {
        return this.props.stateNavigator || (<any> this.context).stateNavigator;
    }
    
    private getNavigationBackLink(props = this.props): string {
        try {
            return this.getStateNavigator().getNavigationBackLink(props.distance);
        } catch (e) {
            return null;
        }
    }

    componentDidMount() {
        if (!this.props.lazy)
            this.getStateNavigator().onNavigate(this.onNavigate);
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState(this.getComponentState(nextProps))
    }
    componentWillUnmount() {
        if (!this.props.lazy)
            this.getStateNavigator().offNavigate(this.onNavigate);
    }
    
    getComponentState(props = this.props): NavigationBackLinkState {
        var link = this.getNavigationBackLink(props);
        return { link };
    }

    render() {
        var props: any = {};
        for(var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        props.href = this.state.link && this.getStateNavigator().historyManager.getHref(this.state.link);
        LinkUtility.addListeners(this, this.getStateNavigator(), this.props, props, () => this.getNavigationBackLink(), this.state.link);
        return React.createElement('a', props, this.props.children);
    }
};
export default NavigationBackLink;
