import LinkUtility from './LinkUtility';
import { StateNavigator } from 'navigation';
import { NavigationBackLinkProps } from './Props';
import * as React from 'react';

class NavigationBackLink extends React.Component<NavigationBackLinkProps, any> {
    private onNavigate = () => {
        var link = this.getNavigationBackLink();
        if (this.state.link !== link)
            this.setState({ link });
    }

    constructor(props, context) {
        super(props, context);
        this.state = { link: this.getNavigationBackLink() };
    }

    static contextTypes = {
        stateNavigator: () => {}
    }
    
    private getStateNavigator(): StateNavigator {
        return this.props.stateNavigator || (<any> this.context).stateNavigator;
    }
    
    private getNavigationBackLink(): string {
        try {
            return this.getStateNavigator().getNavigationBackLink(this.props.distance);
        } catch (e) {
            return null;
        }
    }

    componentDidMount() {
        if (!this.props.lazy)
            this.getStateNavigator().onNavigate(this.onNavigate);
    }
    
    componentWillReceiveProps() {
        this.setState({ link: this.getNavigationBackLink() });
    }
    componentWillUnmount() {
        if (!this.props.lazy)
            this.getStateNavigator().offNavigate(this.onNavigate);
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
