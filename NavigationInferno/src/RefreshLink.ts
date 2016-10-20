import LinkUtility from './LinkUtility';
import { StateNavigator } from 'navigation';
import InfernoComponent from 'inferno-component';
import createElement from 'inferno-create-element';

class RefreshLink extends InfernoComponent {
    private onNavigate = () => this.forceUpdate();
    
    private getStateNavigator(): StateNavigator {
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
        var props: any = { ref: 'el' };
        for(var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        props.href = this.getRefreshLink();
        LinkUtility.addListeners(this, this.getStateNavigator(), this.props, props, () => this.getRefreshLink());
        LinkUtility.setActive(this.getStateNavigator(), this.props, props);
        return createElement('a', props, this.props.children);
    }
};
export default RefreshLink;
