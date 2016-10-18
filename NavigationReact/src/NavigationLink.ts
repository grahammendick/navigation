import LinkUtility from './LinkUtility';
import * as Navigation from 'navigation';
import * as React from 'react';

class NavigationLink extends React.Component<any, any> {
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
    
    private getStateNavigator(): Navigation.StateNavigator {
        return this.props.stateNavigator || (<any> this.context).stateNavigator;
    }
    
    private getNavigationLink(): string {
        var navigationData = LinkUtility.getData(this.getStateNavigator(), this.props.navigationData, this.props.includeCurrentData, this.props.currentDataKeys);
        return LinkUtility.getLink(this.getStateNavigator(), () => this.getStateNavigator().getNavigationLink(this.props.stateKey, navigationData));
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
        props.href = this.getNavigationLink();
        LinkUtility.addListeners(this, this.getStateNavigator(), this.props, props, () => this.getNavigationLink());
        if (this.getStateNavigator().stateContext.state && this.getStateNavigator().stateContext.state.key === this.props.stateKey)
            LinkUtility.setActive(this.getStateNavigator(), this.props, props);
        return React.createElement('a', props, this.props.children);
    }
};
export default NavigationLink;
