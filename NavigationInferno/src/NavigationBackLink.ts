import LinkUtility from './LinkUtility';
import { StateNavigator } from 'navigation';
import InfernoComponent from 'inferno-component';
import createElement from 'inferno-create-element';

class NavigationBackLink extends InfernoComponent {
    private onNavigate = () => this.forceUpdate();
    
    private getStateNavigator(): StateNavigator {
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
        var props: any = { ref: 'el' };
        for(var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        props.href = this.getNavigationBackLink();
        LinkUtility.addListeners(this, this.getStateNavigator(), this.props, props, () => this.getNavigationBackLink());
        return createElement('a', props, this.props.children);
    }
};
export default NavigationBackLink;
