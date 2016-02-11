import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import React = require('react');

class RefreshLink extends React.Component<any, any> {
    private onNavigate = () => this.forceUpdate();
    
    private getStateController(): Navigation.StateController {
        return this.props.stateController;
    }
    
    getRefreshLink(): string {
        var toData = LinkUtility.getData(this.getStateController(), this.props.toData, this.props.includeCurrentData, this.props.currentDataKeys);
        return LinkUtility.getLink(this.getStateController(), () => this.getStateController().getRefreshLink(toData));
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
        var active = true;
        for (var key in this.props.toData) {
            active = active && LinkUtility.isActive(this.getStateController(), key, this.props.toData[key]);
        }
        props.href = this.getRefreshLink();
        LinkUtility.addListeners(this, props, () => this.getRefreshLink());
        active = active && !!props.href;
        LinkUtility.setActive(props, active, this.props.activeCssClass, this.props.disableActive);
        return React.createElement(props.href ? 'a' : 'span', props);
    }
};
export = RefreshLink;
