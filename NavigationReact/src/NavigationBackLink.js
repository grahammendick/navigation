var LinkUtility = require('./LinkUtility');
var Navigation = require('navigation');
var React = require('react');

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
        LinkUtility.setLink(this, props, function () {
            return Navigation.StateController.getNavigationBackLink(distance);
        });
        return LinkUtility.createElement(props);
    }
});
module.exports = NavigationBackLink;
//# sourceMappingURL=NavigationBackLink.js.map
