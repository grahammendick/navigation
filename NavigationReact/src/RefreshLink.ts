import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import React = require('react');

var RefreshLink = React.createClass({
    onNavigate: function () {
        this.forceUpdate();
    },
    setRefreshLink: function() {
        var toData = LinkUtility.getData(this.props.toData, this.props.includeCurrentData, this.props.currentDataKeys);
        LinkUtility.setLink(this.props, () => Navigation.StateController.getRefreshLink(toData));
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
        this.setRefreshLink();
        LinkUtility.addListeners(this, this.props, () => this.setRefreshLink(), !!this.props.lazy);
        return React.createElement(this.props.href ? 'a' : 'span', this.props);
    }
});
export = RefreshLink;
