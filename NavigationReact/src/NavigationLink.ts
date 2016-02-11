import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import React = require('react');

class NavigationLink extends React.Component<any, any> {
    private onNavigate = () => this.forceUpdate();
    
    private getStateController(): Navigation.StateController {
        return this.props.stateController;
    }
    
    private getNavigationLink(): string {
        var toData = LinkUtility.getData(this.getStateController(), this.props.toData, this.props.includeCurrentData, this.props.currentDataKeys);
        return LinkUtility.getLink(this.getStateController(), () => this.getStateController().getNavigationLink(this.props.action, toData));
    }
    
    private isActive(action: string): boolean {
        var nextState = this.getStateController().getNextState(action);
        return nextState === nextState.parent.initial && nextState.parent === this.getStateController().stateContext.dialog;
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
        props.href = this.getNavigationLink();
        LinkUtility.addListeners(this, props, () => this.getNavigationLink());
        active = active && !!props.href && this.isActive(this.props.action);
        LinkUtility.setActive(props, active, this.props.activeCssClass, this.props.disableActive);
        return React.createElement(props.href ? 'a' : 'span', props);
    }
};
export = NavigationLink;
