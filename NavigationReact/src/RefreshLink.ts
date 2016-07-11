import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import React = require('react');

class RefreshLink extends React.Component<any, any> {
    private onNavigate = () => this.forceUpdate();
    
    static contextTypes = {
        stateNavigator: React.PropTypes.object
    }
    
    private getStateNavigator(): Navigation.StateNavigator {
        return this.props.stateNavigator || (<any> this.context).stateNavigator;
    }
    
    getRefreshLink(): string {
        var navigationData = LinkUtility.getData(this.getStateNavigator(), this.props.navigationData, this.props.includeCurrentData, this.props.currentDataKeys);
        return LinkUtility.getLink(this.getStateNavigator(), () => this.getStateNavigator().getRefreshLink(navigationData));
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
        for(var key in this.props)
            props[key] = this.props[key];
        var active = true;
        for (var key in this.props.navigationData) {
            active = active && LinkUtility.isActive(this.getStateNavigator(), key, this.props.navigationData[key]);
        }
        props.href = this.getRefreshLink();
        LinkUtility.addListeners(this, this.getStateNavigator(), props, () => this.getRefreshLink());
        active = active && !!props.href;
        LinkUtility.setActive(props, active, this.props.activeCssClass, this.props.disableActive);
        return React.createElement('a', props);
    }
};
export = RefreshLink;
