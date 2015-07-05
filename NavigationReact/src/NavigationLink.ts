import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import React = require('react');

var NavigationLink = React.createClass({
    onNavigate: function () {
        this.forceUpdate();
    },
    setNavigationLink: function() {
        var toData = LinkUtility.getData(this.props.toData, this.props.includeCurrentData, this.props.currentDataKeys);
        LinkUtility.setLink(this.props, () => Navigation.StateController.getNavigationLink(this.props.action, toData));
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
        this.setNavigationLink();
        LinkUtility.addListeners(this, this.props, () => this.setNavigationLink(), !!this.props.lazy);
        return React.createElement(this.props.href ? 'a' : 'span', this.props);
    }
});
export = NavigationLink;
