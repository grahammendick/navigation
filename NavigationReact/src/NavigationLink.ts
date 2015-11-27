import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import React = require('react');

class NavigationLink extends React.Component<any, any> {
    private getNavigationLink(): string {
        var toData = LinkUtility.getData(this.props.toData, this.props.includeCurrentData, this.props.currentDataKeys);
        return LinkUtility.getLink(() => Navigation.StateController.getNavigationLink(this.props.action, toData));
    }
    
    private isActive(action: string): boolean {
        var nextState = Navigation.StateController.getNextState(action);
        return nextState === nextState.parent.initial && nextState.parent === Navigation.StateContext.dialog;
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
        var active = true;
        for (var key in this.props.toData) {
            active = active && LinkUtility.isActive(key, this.props.toData[key]);
        }
        props.href = this.getNavigationLink();
        LinkUtility.addListeners(this, props, () => this.getNavigationLink());
        active = active && !!props.href && this.isActive(this.props.action);
        LinkUtility.setActive(props, active, this.props.activeCssClass, this.props.disableActive);
        return React.createElement(props.href ? 'a' : 'span', props);
    }
};
export = NavigationLink;
