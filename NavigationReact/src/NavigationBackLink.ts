import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import React = require('react');

var NavigationBackLink = React.createClass({
    onNavigate: function () {
        this.forceUpdate();
    },
    setNavigationBackLink: function() {
        LinkUtility.setLink(this, this.props, () => Navigation.StateController.getNavigationBackLink(this.props.distance));
    },
    componentDidMount: function () {
        if (!this.props.lazy)
            Navigation.StateController.onNavigate(this.onNavigate);
    },
    componentWillUnmount: function () {
        if (!this.props.lazy)
            Navigation.StateController.offNavigate(this.onNavigate);
    },
    render: function () {
        this.setNavigationBackLink();
        LinkUtility.addListeners(this, this.props, () => this.setNavigationBackLink(), !!this.props.lazy);
        return LinkUtility.createElement(this.props);
    }
});
export = NavigationBackLink;
