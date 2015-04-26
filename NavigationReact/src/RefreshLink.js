var LinkUtility = require('./LinkUtility');
var Navigation = require('navigation');
var React = require('react');

var RefreshLink = React.createClass({
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
        var toData = LinkUtility.getData(props.toData, props.includeCurrentData, props.currentDataKeys);
        LinkUtility.setLink(this, props, function () {
            return Navigation.StateController.getRefreshLink(toData);
        });
        return LinkUtility.createElement(props);
    }
});
module.exports = RefreshLink;
//# sourceMappingURL=RefreshLink.js.map
