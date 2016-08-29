import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import React = require('react');

class NavigationBackLink extends React.Component<any, any> {
    private onNavigate = () => this.setState({ stateContext: this.getStateNavigator().stateContext.url });

    constructor(props, context) {
        super(props, context);
        this.state = { stateContext: this.getStateNavigator().stateContext.url };
    }

    static contextTypes = {
        stateNavigator: React.PropTypes.object
    }
    
    private getStateNavigator(): Navigation.StateNavigator {
        return this.props.stateNavigator || (<any> this.context).stateNavigator;
    }
    
    private getNavigationBackLink(): string {
        return LinkUtility.getLink(this.getStateNavigator(), () => this.getStateNavigator().getNavigationBackLink(this.props.distance));
    }
    
    componentDidMount() {
        if (!this.props.lazy)
            this.getStateNavigator().onNavigate(this.onNavigate);
    }
    
    componentWillUnmount() {
        if (!this.props.lazy)
            this.getStateNavigator().offNavigate(this.onNavigate);
    }
    
    render() {
        var props: any = { ref: (el) => this['el'] = el };
        for(var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        props.href = this.getNavigationBackLink();
        LinkUtility.addListeners(this, this.getStateNavigator(), this.props, props, () => this.getNavigationBackLink());
        return React.createElement('a', props, this.props.children);
    }
};
export = NavigationBackLink;
