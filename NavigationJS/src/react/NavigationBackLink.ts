import LinkUtility = require('./LinkUtility');
import Navigation = require('../Navigation');
import React = require('react');

var NavigationBackLink = React.createClass({
    onNavigate: function () {
        this.forceUpdate();
    },
    componentDidMount: function () {
        Navigation.StateController.onNavigate(this.onNavigate);
    },
    componentWillUnmount: function () {
        Navigation.StateController.offNavigate(this.onNavigate);
    },
    render: function () {
        var props = LinkUtility.cloneProps(this);
        var distance = props.distance;
        LinkUtility.setLink(this, props, () => Navigation.StateController.getNavigationBackLink(distance));
        return LinkUtility.createElement(props);
    }
});
export = NavigationBackLink;
