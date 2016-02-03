import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import React = require('react');

class NavigationBackLink extends React.Component<any, any> {
    private onNavigate = () => this.forceUpdate();
    
    private getNavigationBackLink(): string {
        return LinkUtility.getLink(this.props.stateController, () => this.props.stateController.getNavigationBackLink(this.props.distance));
    }
    
    componentDidMount() {
        if (!this.props.lazy)
            this.props.stateController.onNavigate(this.onNavigate);
    }
    
    componentWillUnmount() {
        if (!this.props.lazy)
            this.props.stateController.offNavigate(this.onNavigate);
    }
    
    render() {
        var props: any = {};
        for(var key in this.props)
            props[key] = this.props[key];
        props.href = this.getNavigationBackLink();
        LinkUtility.addListeners(this, props, () => this.getNavigationBackLink());
        return React.createElement(props.href ? 'a' : 'span', props);
    }
};
export = NavigationBackLink;
