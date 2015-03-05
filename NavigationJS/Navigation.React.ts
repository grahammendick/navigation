module NavigationReact {
    export var NavigationLink = React.createClass({
        render: function () {
            var props = cloneProps(this);
            var includeCurrentData = props.includeCurrentData;
            var currentDataKeys = props.currentDataKeys;
            var action = props.action;
            var toData = getData(props.toData, includeCurrentData, currentDataKeys);
            var link = Navigation.StateController.getNavigationLink(action, toData);
            props.href = Navigation.historyManager.getHref(link);
            props.onClick = getClickListener(() => Navigation.StateController.navigate(action, toData))
            clearProps(props);
            return (
                React.createElement('a', props)
            );
        }
    });

    function cloneProps(elem: React.ReactElement<any, any>): any {
        var props = {};
        for (var key in elem.props) {
            props[key] = elem.props[key];
        }
        return props;
    }

    function getData(toData, includeCurrentData: boolean, currentDataKeys: string) {
        if (includeCurrentData)
            toData = Navigation.StateContext.includeCurrentData(toData);
        if (currentDataKeys)
            toData = Navigation.StateContext.includeCurrentData(toData, currentDataKeys.trim().split(/\s*,\s*/));
        return toData;
    }

    function getClickListener(listener: () => void) {
        return (e: MouseEvent) => {
            if (!e.ctrlKey && !e.shiftKey) {
                e.preventDefault();
                listener();
            }
        };
    }

    function clearProps(props: any) {
        delete props.action;
        delete props.toData;
        delete props.includeCurrentData;
        delete props.currentDataKeys;
    }
}
var NavigationLink = NavigationReact.NavigationLink;