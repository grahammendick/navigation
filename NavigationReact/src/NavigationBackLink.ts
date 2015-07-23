import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import React = require('react');

var NavigationBackLink = React.createClass({
    onNavigate() {
        this.forceUpdate();
    },
    getNavigationBackLink(): string {
        return LinkUtility.getLink(() => Navigation.StateController.getNavigationBackLink(this.props.distance));
    },
    componentDidMount() {
        if (!this.props.lazy)
            Navigation.StateController.onNavigate(this.onNavigate);
    },
    componentWillUnmount() {
        if (!this.props.lazy)
            Navigation.StateController.offNavigate(this.onNavigate);
    },
    render() {
        var props: any = {};
        for(var key in this.props)
            props[key] = this.props[key];
        props.href = this.getNavigationBackLink();
        LinkUtility.addListeners(this, props, () => this.getNavigationBackLink(), !!this.props.lazy);
        return React.createElement(props.href ? 'a' : 'span', props);
    }
});
export = NavigationBackLink;
