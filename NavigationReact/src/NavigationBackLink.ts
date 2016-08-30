import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import React = require('react');

class NavigationBackLink extends React.Component<any, any> {
    private onNavigate = () => {
        if (this.state.stateContext !== this.getStateNavigator().stateContext.url
            || this.state.crumb !== this.getNavigationBackLink())
            this.setState(this.getNextState());
    }

    constructor(props, context) {
        super(props, context);
        this.state = this.getNextState();
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

    private getNextState() {
        return { 
            stateContext: this.getStateNavigator().stateContext.url,
            crumb: this.getNavigationBackLink()
        };
    }
    
    componentDidMount() {
        if (!this.props.lazy)
            this.getStateNavigator().onNavigate(this.onNavigate);
    }
    
    componentWillReceiveProps() {
        this.setState(this.getNextState());
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
