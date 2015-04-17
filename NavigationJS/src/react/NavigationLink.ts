import LinkUtility = require('./LinkUtility');
import Navigation = require('../Navigation');
import React = require('react');

var NavigationLink = React.createClass({
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
        var action = props.action;
        var toData = LinkUtility.getData(props.toData, props.includeCurrentData, props.currentDataKeys);
        LinkUtility.setLink(this, props, () => Navigation.StateController.getNavigationLink(action, toData));
        return LinkUtility.createElement(props);
    }
});
export = NavigationLink;
