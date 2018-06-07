/**
 * Navigation React v4.0.0
 * (c) Graham Mendick - http://grahammendick.github.io/navigation/
 * License: Apache-2.0
 */
var NavigationReact = (function (exports,navigation,ReactDOM,React) {
    'use strict';

    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    var AsyncStateNavigator = /** @class */ (function (_super) {
        __extends(AsyncStateNavigator, _super);
        function AsyncStateNavigator(navigationHandler, stateNavigator, stateContext) {
            var _this = _super.call(this, stateNavigator, stateNavigator.historyManager) || this;
            _this.navigationHandler = navigationHandler;
            _this.stateNavigator = stateNavigator;
            _this.stateContext = stateContext;
            _this.configure = stateNavigator.configure.bind(stateNavigator);
            _this.onBeforeNavigate = stateNavigator.onBeforeNavigate.bind(stateNavigator);
            _this.offBeforeNavigate = stateNavigator.offBeforeNavigate.bind(stateNavigator);
            _this.onNavigate = stateNavigator.onNavigate.bind(stateNavigator);
            _this.offNavigate = stateNavigator.offNavigate.bind(stateNavigator);
            return _this;
        }
        AsyncStateNavigator.prototype.navigate = function (stateKey, navigationData, historyAction, defer) {
            var url = this.getNavigationLink(stateKey, navigationData);
            if (url == null)
                throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
            this.navigateLink(url, historyAction, false, undefined, defer);
        };
        AsyncStateNavigator.prototype.navigateBack = function (distance, historyAction, defer) {
            var url = this.getNavigationBackLink(distance);
            this.navigateLink(url, historyAction, false, undefined, defer);
        };
        AsyncStateNavigator.prototype.refresh = function (navigationData, historyAction, defer) {
            var url = this.getRefreshLink(navigationData);
            if (url == null)
                throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
            this.navigateLink(url, historyAction, false, undefined, defer);
        };
        AsyncStateNavigator.prototype.navigateLink = function (url, historyAction, history, suspendNavigation, defer) {
            var _this = this;
            if (historyAction === void 0) { historyAction = 'add'; }
            if (history === void 0) { history = false; }
            if (defer === void 0) { defer = false; }
            if (!suspendNavigation)
                suspendNavigation = function (stateContext, resumeNavigation) { return resumeNavigation(); };
            this.stateNavigator.navigateLink(url, historyAction, history, function (stateContext, resumeNavigation) {
                suspendNavigation(stateContext, function () {
                    var asyncNavigator = new AsyncStateNavigator(_this.navigationHandler, _this.stateNavigator, stateContext);
                    _this.suspendNavigation(asyncNavigator, resumeNavigation, defer);
                });
            });
        };
        AsyncStateNavigator.prototype.suspendNavigation = function (asyncNavigator, resumeNavigation, defer) {
            var _this = this;
            defer = defer && ReactDOM.unstable_deferredUpdates;
            var _a = asyncNavigator.stateContext, oldState = _a.oldState, oldUrl = _a.oldUrl, state = _a.state, data = _a.data, url = _a.url, asyncData = _a.asyncData;
            if (defer) {
                this.navigationHandler.setState(function (_a) {
                    var context = _a.context;
                    if (oldUrl === context.stateNavigator.stateContext.url)
                        return { context: __assign({}, context, { nextState: state, nextData: data }) };
                    return null;
                });
            }
            var wrapDefer = function (setState) { return defer ? ReactDOM.unstable_deferredUpdates(function () { return setState(); }) : setState(); };
            wrapDefer(function () {
                _this.navigationHandler.setState(function () { return ({ context: { oldState: oldState, state: state, data: data, asyncData: asyncData, nextState: null, nextData: {}, stateNavigator: asyncNavigator } }); }, function () {
                    if (url === _this.navigationHandler.state.context.stateNavigator.stateContext.url)
                        resumeNavigation();
                });
            });
        };
        return AsyncStateNavigator;
    }(navigation.StateNavigator));

    var NavigationContext = React.createContext({ oldState: null, state: null, data: {}, nextState: null, nextData: {}, stateNavigator: new navigation.StateNavigator() });

    var NavigationHandler = /** @class */ (function (_super) {
        __extends(NavigationHandler, _super);
        function NavigationHandler(props) {
            var _this = _super.call(this, props) || this;
            var stateNavigator = _this.props.stateNavigator;
            var _a = stateNavigator.stateContext, oldState = _a.oldState, state = _a.state, data = _a.data, asyncData = _a.asyncData;
            var asyncNavigator = new AsyncStateNavigator(_this, stateNavigator, stateNavigator.stateContext);
            _this.state = { context: { oldState: oldState, state: state, data: data, asyncData: asyncData, nextState: null, nextData: {}, stateNavigator: asyncNavigator } };
            _this.onNavigate = _this.onNavigate.bind(_this);
            return _this;
        }
        NavigationHandler.prototype.componentDidMount = function () {
            this.props.stateNavigator.onNavigate(this.onNavigate);
        };
        NavigationHandler.prototype.componentWillUnmount = function () {
            this.props.stateNavigator.offNavigate(this.onNavigate);
        };
        NavigationHandler.prototype.onNavigate = function () {
            var _this = this;
            var stateNavigator = this.props.stateNavigator;
            if (this.state.context.stateNavigator.stateContext !== stateNavigator.stateContext) {
                this.setState(function () {
                    var _a = stateNavigator.stateContext, oldState = _a.oldState, state = _a.state, data = _a.data, asyncData = _a.asyncData;
                    var asyncNavigator = new AsyncStateNavigator(_this, stateNavigator, stateNavigator.stateContext);
                    return { context: { oldState: oldState, state: state, data: data, asyncData: asyncData, nextState: null, nextData: {}, stateNavigator: asyncNavigator } };
                });
            }
        };
        NavigationHandler.prototype.render = function () {
            return (React.createElement(NavigationContext.Provider, { value: this.state.context }, this.props.children));
        };
        return NavigationHandler;
    }(React.Component));

    var LinkUtility = /** @class */ (function () {
        function LinkUtility() {
        }
        LinkUtility.getData = function (stateNavigator, navigationData, includeCurrentData, currentDataKeys) {
            if (currentDataKeys || includeCurrentData) {
                var keys = typeof currentDataKeys === 'string' ? currentDataKeys.trim().split(/\s*,\s*/) : currentDataKeys;
                navigationData = stateNavigator.stateContext.includeCurrentData(navigationData, keys);
            }
            return navigationData;
        };
        LinkUtility.isActive = function (stateNavigator, navigationData) {
            var active = true;
            for (var key in navigationData) {
                var val = navigationData[key];
                active = active && (val == null || this.areEqual(val, stateNavigator.stateContext.data[key]));
            }
            return active;
        };
        LinkUtility.setActive = function (active, props, toProps) {
            if (active && props.activeStyle)
                toProps.style = __assign({}, toProps.style, props.activeStyle);
            if (active && props.activeCssClass)
                toProps.className = (!toProps.className ? '' : toProps.className + ' ') + props.activeCssClass;
            if (active && props.disableActive) {
                toProps.href = null;
                toProps.onClick = null;
            }
        };
        LinkUtility.areEqual = function (val, currentVal) {
            if (currentVal == null)
                return val == null || val === '';
            var valType = Object.prototype.toString.call(val);
            if (valType !== Object.prototype.toString.call(currentVal))
                return false;
            if (valType === '[object Array]') {
                var active = val.length === currentVal.length;
                for (var i = 0; active && i < val.length; i++) {
                    active = this.areEqual(val[i], currentVal[i]);
                }
                return active;
            }
            else {
                return isNaN(val) ? val === currentVal : +val === +currentVal;
            }
        };
        LinkUtility.toHtmlProps = function (props) {
            var htmlProps = {};
            for (var key in props) {
                if (key !== 'stateNavigator' && key !== 'stateKey' && key !== 'navigationData'
                    && key !== 'includeCurrentData' && key !== 'currentDataKeys' && key !== 'activeStyle'
                    && key !== 'activeCssClass' && key !== 'disableActive' && key !== 'distance'
                    && key !== 'historyAction' && key !== 'navigating' && key !== 'defer')
                    htmlProps[key] = props[key];
            }
            return htmlProps;
        };
        LinkUtility.getOnClick = function (stateNavigator, props, link) {
            return function (e) {
                if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                    var navigating = props.navigating, historyAction = props.historyAction, defer = props.defer;
                    if (!navigating || navigating(e, link)) {
                        e.preventDefault();
                        stateNavigator.navigateLink(link, historyAction, false, undefined, defer);
                    }
                }
            };
        };
        return LinkUtility;
    }());

    var withStateNavigator = (function (Link) { return function (props) { return (React.createElement(NavigationContext.Consumer, null, function (_a) {
        var stateNavigator = _a.stateNavigator;
        return React.createElement(Link, __assign({}, props, { stateNavigator: stateNavigator }));
    })); }; });

    var NavigationBackLink = function (props) {
        var htmlProps = LinkUtility.toHtmlProps(props);
        var distance = props.distance, stateNavigator = props.stateNavigator;
        try {
            var link = stateNavigator.getNavigationBackLink(distance);
        }
        catch (_a) { }
        htmlProps.href = link && stateNavigator.historyManager.getHref(link);
        htmlProps.onClick = link && LinkUtility.getOnClick(stateNavigator, props, link);
        return React.createElement("a", __assign({}, htmlProps));
    };
    var NavigationBackLink$1 = withStateNavigator(NavigationBackLink);

    var NavigationLink = function (props) {
        var htmlProps = LinkUtility.toHtmlProps(props);
        var stateKey = props.stateKey, navigationData = props.navigationData, includeCurrentData = props.includeCurrentData, currentDataKeys = props.currentDataKeys, stateNavigator = props.stateNavigator;
        var state = stateNavigator.stateContext.state;
        navigationData = LinkUtility.getData(stateNavigator, navigationData, includeCurrentData, currentDataKeys);
        try {
            var link = stateNavigator.getNavigationLink(stateKey, navigationData);
        }
        catch (_a) { }
        htmlProps.href = link && stateNavigator.historyManager.getHref(link);
        htmlProps.onClick = link && LinkUtility.getOnClick(stateNavigator, props, link);
        var active = state && state.key === stateKey && LinkUtility.isActive(stateNavigator, navigationData);
        LinkUtility.setActive(active, props, htmlProps);
        return React.createElement("a", __assign({}, htmlProps));
    };
    var NavigationLink$1 = withStateNavigator(NavigationLink);

    var RefreshLink = function (props) {
        var htmlProps = LinkUtility.toHtmlProps(props);
        var navigationData = props.navigationData, includeCurrentData = props.includeCurrentData, currentDataKeys = props.currentDataKeys, stateNavigator = props.stateNavigator;
        navigationData = LinkUtility.getData(stateNavigator, navigationData, includeCurrentData, currentDataKeys);
        try {
            var link = stateNavigator.getRefreshLink(navigationData);
        }
        catch (_a) { }
        htmlProps.href = link && stateNavigator.historyManager.getHref(link);
        htmlProps.onClick = link && LinkUtility.getOnClick(stateNavigator, props, link);
        var active = LinkUtility.isActive(stateNavigator, navigationData);
        LinkUtility.setActive(active, props, htmlProps);
        return React.createElement("a", __assign({}, htmlProps));
    };
    var RefreshLink$1 = withStateNavigator(RefreshLink);

    exports.AsyncStateNavigator = AsyncStateNavigator;
    exports.NavigationContext = NavigationContext;
    exports.NavigationHandler = NavigationHandler;
    exports.NavigationBackLink = NavigationBackLink$1;
    exports.NavigationLink = NavigationLink$1;
    exports.RefreshLink = RefreshLink$1;

    return exports;

}({},Navigation,ReactDOM,React));
