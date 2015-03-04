var NavigationLink = React.createClass({
    navigate: function (e) {
        if (!e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            Navigation.StateController.navigate(this.props.action, this.props.toData);
        }
    },
    render: function () {
        var data: any = {};
        for (var key in this.props) {
            data[key] = this.props[key];
        }
        var link = Navigation.StateController.getNavigationLink(this.props.action, this.props.toData);
        data.href = Navigation.historyManager.getHref(link);
        data.onClick = this.navigate;
        delete data.action;
        delete data.toData;
        return (
            React.createElement('a', data)
        )
    }
});
