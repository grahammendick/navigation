import LinkUtility = require('./LinkUtility');

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
        LinkUtility.setLink(this, props, () => Navigation.StateController.getRefreshLink(toData));
        return LinkUtility.createElement(props);
    }
});
export = RefreshLink;
