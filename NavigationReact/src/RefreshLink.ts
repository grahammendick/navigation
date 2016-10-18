import LinkUtility from './LinkUtility';
import { StateNavigator } from 'navigation';
import * as React from 'react';

class RefreshLink extends React.Component<any, any> {
    private onNavigate = () => {
        if (this.state.stateContext !== this.getStateNavigator().stateContext.url)
            this.setState(this.getNextState());
    }

    constructor(props, context) {
        super(props, context);
        this.state = this.getNextState();
    }

    static contextTypes = {
        stateNavigator: React.PropTypes.object
    }
    
    private getStateNavigator(): StateNavigator {
        return this.props.stateNavigator || (<any> this.context).stateNavigator;
    }
    
    private getRefreshLink(): string {
        var navigationData = LinkUtility.getData(this.getStateNavigator(), this.props.navigationData, this.props.includeCurrentData, this.props.currentDataKeys);
        return LinkUtility.getLink(this.getStateNavigator(), () => this.getStateNavigator().getRefreshLink(navigationData));
    }
    
    private getNextState() {
        return { stateContext: this.getStateNavigator().stateContext.url };
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
        props.href = this.getRefreshLink();
        LinkUtility.addListeners(this, this.getStateNavigator(), this.props, props, () => this.getRefreshLink());
        LinkUtility.setActive(this.getStateNavigator(), this.props, props);
        return React.createElement('a', props, this.props.children);
    }
};
export default RefreshLink;
