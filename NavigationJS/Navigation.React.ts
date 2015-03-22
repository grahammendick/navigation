module NavigationReact {
    export var NavigationLink = React.createClass({
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
            var props = cloneProps(this);
            var action = props.action;
            var toData = getData(props.toData, props.includeCurrentData, props.currentDataKeys);
            setLink(this, props, () => Navigation.StateController.getNavigationLink(action, toData));
            return createElement(props);
        }
    });

    export var NavigationBackLink = React.createClass({
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
            var props = cloneProps(this);
            var distance = props.distance;
            setLink(this, props, () => Navigation.StateController.getNavigationBackLink(distance));
            return createElement(props);
        }
    });

    export var RefreshLink = React.createClass({
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
            var props = cloneProps(this);
            var toData = getData(props.toData, props.includeCurrentData, props.currentDataKeys);
            setLink(this, props, () => Navigation.StateController.getRefreshLink(toData));
            return createElement(props);
        }
    });

    function cloneProps(elem: React.ReactElement<any, any>): any {
        var props = {};
        for (var key in elem.props) {
            props[key] = elem.props[key];
        }
        return props;
    }

    function setLink(component: any, props: any, linkAccessor: () => string) {
        try {
            props.href = Navigation.historyManager.getHref(linkAccessor());
            props.onClick = (e) => onClick(e, component.getDOMNode());
        } catch (e) {
            props.href = null;
        }
    }

    function getData(toData, includeCurrentData: boolean, currentDataKeys: string): any {
        if (currentDataKeys)
            toData = Navigation.StateContext.includeCurrentData(toData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            toData = Navigation.StateContext.includeCurrentData(toData);
        return toData;
    }

    function onClick(e: MouseEvent, element: HTMLAnchorElement) {
        if (!e.ctrlKey && !e.shiftKey) {
            if (element.href) {
                e.preventDefault();
                Navigation.StateController.navigateLink(Navigation.historyManager.getUrl(element));
            }
        }
    }

    function createElement(props: any) {
        delete props.action;
        delete props.toData;
        delete props.includeCurrentData;
        delete props.currentDataKeys;
        delete props.distance;
        return React.createElement(props.href ? 'a' : 'span', props);
    }
}
var NavigationLink = NavigationReact.NavigationLink;
var NavigationBackLink = NavigationReact.NavigationBackLink;
var RefreshLink = NavigationReact.RefreshLink;