import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import React = require('react');

class RefreshLink extends React.Component<any, any> {
    private onNavigate = () => this.forceUpdate();
    
    getRefreshLink(): string {
        var toData = LinkUtility.getData(this.props.toData, this.props.includeCurrentData, this.props.currentDataKeys);
        return LinkUtility.getLink(() => Navigation.StateController.getRefreshLink(toData));
    }
    
    componentDidMount() {
        if (!this.props.lazy)
            Navigation.StateController.onNavigate(this.onNavigate);
    }
    
    componentWillUnmount() {
        if (!this.props.lazy)
            Navigation.StateController.offNavigate(this.onNavigate);
    }
    
    render() {
        var props: any = {};
        for(var key in this.props)
            props[key] = this.props[key];
        var active = true;
        for (var key in this.props.toData) {
            active = active && LinkUtility.isActive(key, this.props.toData[key]);
        }
        props.href = this.getRefreshLink();
        LinkUtility.addListeners(this, props, () => this.getRefreshLink());
        active = active && !!props.href;
        LinkUtility.setActive(props, active, this.props.activeCssClass, this.props.disableActive);
        return React.createElement(props.href ? 'a' : 'span', props);
    }
};
export = RefreshLink;
