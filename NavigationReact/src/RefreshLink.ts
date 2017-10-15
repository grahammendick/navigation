import LinkUtility from './LinkUtility';
import { StateNavigator } from 'navigation';
import { RefreshLinkProps } from './Props';
import * as React from 'react';

class RefreshLink extends React.Component<RefreshLinkProps, any> {
    private onNavigate = () => {
        var link = this.getRefreshLink();
        if (this.state.link !== link)
            this.setState({ link });
    }

    constructor(props, context) {
        super(props, context);
        this.state = { link: this.getRefreshLink() };
    }

    static contextTypes = {
        stateNavigator: () => {}
    }
    
    private getStateNavigator(): StateNavigator {
        return this.props.stateNavigator || (<any> this.context).stateNavigator;
    }
    
    private getRefreshLink(): string {
        var navigationData = LinkUtility.getData(this.getStateNavigator(), this.props.navigationData, this.props.includeCurrentData, this.props.currentDataKeys);
        try {
            return this.getStateNavigator().getRefreshLink(navigationData);
        } catch (e) {
            return null;
        }
    }

    componentDidMount() {
        if (!this.props.lazy)
            this.getStateNavigator().onNavigate(this.onNavigate);
    }

    componentWillReceiveProps() {
        this.setState({ link: this.getRefreshLink() });
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
        LinkUtility.addListeners(this, this.getStateNavigator(), this.props, props, () => this.getRefreshLink(), this.state.link);
        LinkUtility.setActive(this.getStateNavigator(), this.props, props);
        return React.createElement('a', props, this.props.children);
    }
};
export default RefreshLink;
