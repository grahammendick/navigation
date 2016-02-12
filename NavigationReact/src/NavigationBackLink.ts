import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import React = require('react');

class NavigationBackLink extends React.Component<any, any> {
    private onNavigate = () => this.forceUpdate();
    
    private getStateController(): Navigation.StateController {
        return this.props.stateController;
    }
    
    private getNavigationBackLink(): string {
        return LinkUtility.getLink(this.getStateController(), () => this.getStateController().getNavigationBackLink(this.props.distance));
    }
    
    componentDidMount() {
        if (!this.props.lazy)
            this.getStateController().onNavigate(this.onNavigate);
    }
    
    componentWillUnmount() {
        if (!this.props.lazy)
            this.getStateController().offNavigate(this.onNavigate);
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
