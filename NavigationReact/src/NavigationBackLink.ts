import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import React = require('react');

class NavigationBackLink extends React.Component<any, any> {
    private getNavigationBackLink(): string {
        return LinkUtility.getLink(() => Navigation.StateController.getNavigationBackLink(this.props.distance));
    }
    
    componentDidMount() {
        if (!this.props.lazy)
            Navigation.StateController.onNavigate(() => this.forceUpdate());
    }
    
    componentWillUnmount() {
        if (!this.props.lazy)
            Navigation.StateController.offNavigate(() => this.forceUpdate());
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
