/**
 * Navigation React v3.1.0
 * (c) Graham Mendick - http://grahammendick.github.io/navigation/
 * License: Apache-2.0
 */
(function (exports,navigation,React) {
'use strict';

var navigationContext;
var defaultValue = { oldState: null, state: null, data: {}, stateNavigator: new navigation.StateNavigator(), defaultValue: true };
if (React.createContext)
    navigationContext = React.createContext(defaultValue);
else {
    navigationContext = {
        Provider: function () { throw Error("React " + React.version + " does not support the new context"); },
        Consumer: function (_a) {
            var children = _a.children;
            return children(defaultValue);
        }
    };
}
var NavigationContext = navigationContext;




var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends$1(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign$1 = Object.assign || function __assign$1(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

















function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}



function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

var NavigationHandler =  (function (_super) {
    __extends$1(NavigationHandler, _super);
    function NavigationHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onNavigate = function () {
            _this.forceUpdate();
        };
        return _this;
    }
    NavigationHandler.prototype.componentDidMount = function () {
        this.props.stateNavigator.onNavigate(this.onNavigate);
    };
    NavigationHandler.prototype.componentWillUnmount = function () {
        this.props.stateNavigator.offNavigate(this.onNavigate);
    };
    NavigationHandler.prototype.render = function () {
        var _a = this.props, children = _a.children, stateNavigator = _a.stateNavigator;
        var _b = stateNavigator.stateContext, oldState = _b.oldState, state = _b.state, data = _b.data, asyncData = _b.asyncData;
        return (React.createElement(NavigationContext.Provider, { value: { oldState: oldState, state: state, data: data, asyncData: asyncData, stateNavigator: stateNavigator } }, children));
    };
    return NavigationHandler;
}(React.Component));

var LinkUtility =  (function () {
    function LinkUtility() {
    }
    LinkUtility.getData = function (stateNavigator, navigationData, includeCurrentData, currentDataKeys) {
        if (currentDataKeys || includeCurrentData) {
            var keys = includeCurrentData ? undefined : currentDataKeys.trim().split(/\s*,\s*/);
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
        if (!props.activeCssClass && !props.disableActive)
            return;
        if (active && props.activeCssClass)
            toProps.className = (!toProps.className ? '' : toProps.className + ' ') + props.activeCssClass;
        if (active && props.disableActive)
            toProps.href = null;
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
    LinkUtility.isValidAttribute = function (attr) {
        return attr !== 'stateNavigator' && attr !== 'stateKey' && attr !== 'navigationData'
            && attr !== 'includeCurrentData' && attr !== 'currentDataKeys' && attr !== 'activeCssClass'
            && attr !== 'disableActive' && attr !== 'distance' && attr !== 'historyAction'
            && attr !== 'acrossCrumbs' && attr !== 'navigating' && attr !== 'navigationContext' && attr !== 'children';
    };
    LinkUtility.getOnClick = function (stateNavigator, props, link) {
        return function (e) {
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (link) {
                    if (!props.navigating || props.navigating(e, link)) {
                        e.preventDefault();
                        stateNavigator.navigateLink(link, props.historyAction);
                    }
                }
            }
        };
    };
    return LinkUtility;
}());

var withStateNavigator = function (Link) { return function (props) { return (React.createElement(NavigationContext.Consumer, null, function (_a) {
    var stateNavigator = _a.stateNavigator, defaultValue = _a.defaultValue;
    return React.createElement(Link, __assign$1({ stateNavigator: stateNavigator, navigationContext: !defaultValue }, props));
})); }; };

var NavigationBackLink =  (function (_super) {
    __extends$1(NavigationBackLink, _super);
    function NavigationBackLink(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.onNavigate = function () {
            var componentState = _this.getComponentState();
            if (_this.state.link !== componentState.link)
                _this.setState(componentState);
        };
        _this.state = _this.getComponentState(props);
        _this.crumb = _this.getStateNavigator().stateContext.crumbs.length;
        return _this;
    }
    NavigationBackLink.prototype.getStateNavigator = function () {
        return this.context.stateNavigator || this.props.stateNavigator;
    };
    NavigationBackLink.prototype.componentDidMount = function () {
        if (!this.props.navigationContext)
            this.getStateNavigator().onNavigate(this.onNavigate);
    };
    NavigationBackLink.prototype.componentWillReceiveProps = function (nextProps) {
        this.setState(this.getComponentState(nextProps));
    };
    NavigationBackLink.prototype.componentWillUnmount = function () {
        if (!this.props.navigationContext)
            this.getStateNavigator().offNavigate(this.onNavigate);
    };
    NavigationBackLink.prototype.getComponentState = function (props) {
        if (props === void 0) { props = this.props; }
        var crumbs = this.getStateNavigator().stateContext.crumbs;
        var acrossCrumbs = props.acrossCrumbs;
        if (!acrossCrumbs && this.crumb !== undefined && this.crumb !== crumbs.length)
            return this.state;
        var link = this.getNavigationBackLink(props);
        return { link: link };
    };
    NavigationBackLink.prototype.getNavigationBackLink = function (props) {
        try {
            return this.getStateNavigator().getNavigationBackLink(props.distance);
        }
        catch (e) {
            return null;
        }
    };
    NavigationBackLink.prototype.render = function () {
        var props = {};
        for (var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        props.href = this.state.link && this.getStateNavigator().historyManager.getHref(this.state.link);
        props.onClick = LinkUtility.getOnClick(this.getStateNavigator(), this.props, this.state.link);
        return React.createElement("a", __assign$1({}, props), this.props.children);
    };
    NavigationBackLink.contextTypes = {
        stateNavigator: function () { return null; }
    };
    return NavigationBackLink;
}(React.Component));

var NavigationBackLink$1 = withStateNavigator(NavigationBackLink);

var NavigationLink =  (function (_super) {
    __extends$1(NavigationLink, _super);
    function NavigationLink(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.onNavigate = function () {
            var _a = _this.state, link = _a.link, active = _a.active;
            var componentState = _this.getComponentState();
            if (link !== componentState.link || active !== componentState.active)
                _this.setState(componentState);
        };
        _this.state = _this.getComponentState(props);
        _this.crumb = _this.getStateNavigator().stateContext.crumbs.length;
        return _this;
    }
    NavigationLink.prototype.getStateNavigator = function () {
        return this.context.stateNavigator || this.props.stateNavigator;
    };
    NavigationLink.prototype.componentDidMount = function () {
        if (!this.props.navigationContext)
            this.getStateNavigator().onNavigate(this.onNavigate);
    };
    NavigationLink.prototype.componentWillReceiveProps = function (nextProps) {
        this.setState(this.getComponentState(nextProps));
    };
    NavigationLink.prototype.componentWillUnmount = function () {
        if (!this.props.navigationContext)
            this.getStateNavigator().offNavigate(this.onNavigate);
    };
    NavigationLink.prototype.getComponentState = function (props) {
        if (props === void 0) { props = this.props; }
        var _a = this.getStateNavigator().stateContext, crumbs = _a.crumbs, state = _a.state;
        var acrossCrumbs = props.acrossCrumbs, navigationData = props.navigationData, stateKey = props.stateKey;
        if (!acrossCrumbs && this.crumb !== undefined && this.crumb !== crumbs.length)
            return this.state;
        var link = this.getNavigationLink(props);
        var active = state && state.key === stateKey && LinkUtility.isActive(this.getStateNavigator(), navigationData);
        return { link: link, active: active };
    };
    NavigationLink.prototype.getNavigationLink = function (props) {
        var navigationData = props.navigationData, includeCurrentData = props.includeCurrentData, currentDataKeys = props.currentDataKeys;
        var navigationData = LinkUtility.getData(this.getStateNavigator(), navigationData, includeCurrentData, currentDataKeys);
        try {
            return this.getStateNavigator().getNavigationLink(props.stateKey, navigationData);
        }
        catch (e) {
            return null;
        }
    };
    NavigationLink.prototype.render = function () {
        var props = {};
        for (var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        props.href = this.state.link && this.getStateNavigator().historyManager.getHref(this.state.link);
        props.onClick = LinkUtility.getOnClick(this.getStateNavigator(), this.props, this.state.link);
        LinkUtility.setActive(this.state.active, this.props, props);
        return React.createElement("a", __assign$1({}, props), this.props.children);
    };
    NavigationLink.contextTypes = {
        stateNavigator: function () { return null; }
    };
    return NavigationLink;
}(React.Component));

var NavigationLink$1 = withStateNavigator(NavigationLink);

var RefreshLink =  (function (_super) {
    __extends$1(RefreshLink, _super);
    function RefreshLink(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.onNavigate = function () {
            var _a = _this.state, link = _a.link, active = _a.active;
            var componentState = _this.getComponentState();
            if (link !== componentState.link || active !== componentState.active)
                _this.setState(componentState);
        };
        _this.state = _this.getComponentState(props);
        _this.crumb = _this.getStateNavigator().stateContext.crumbs.length;
        return _this;
    }
    RefreshLink.prototype.getStateNavigator = function () {
        return this.context.stateNavigator || this.props.stateNavigator;
    };
    RefreshLink.prototype.componentDidMount = function () {
        if (!this.props.navigationContext)
            this.getStateNavigator().onNavigate(this.onNavigate);
    };
    RefreshLink.prototype.componentWillReceiveProps = function (nextProps) {
        this.setState(this.getComponentState(nextProps));
    };
    RefreshLink.prototype.componentWillUnmount = function () {
        if (!this.props.navigationContext)
            this.getStateNavigator().offNavigate(this.onNavigate);
    };
    RefreshLink.prototype.getComponentState = function (props) {
        if (props === void 0) { props = this.props; }
        var crumbs = this.getStateNavigator().stateContext.crumbs;
        var acrossCrumbs = props.acrossCrumbs, navigationData = props.navigationData;
        if (!acrossCrumbs && this.crumb !== undefined && this.crumb !== crumbs.length)
            return this.state;
        var link = this.getRefreshLink(props);
        var active = LinkUtility.isActive(this.getStateNavigator(), navigationData);
        return { link: link, active: active };
    };
    RefreshLink.prototype.getRefreshLink = function (props) {
        var navigationData = props.navigationData, includeCurrentData = props.includeCurrentData, currentDataKeys = props.currentDataKeys;
        var navigationData = LinkUtility.getData(this.getStateNavigator(), navigationData, includeCurrentData, currentDataKeys);
        try {
            return this.getStateNavigator().getRefreshLink(navigationData);
        }
        catch (e) {
            return null;
        }
    };
    RefreshLink.prototype.render = function () {
        var props = {};
        for (var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        props.href = this.state.link && this.getStateNavigator().historyManager.getHref(this.state.link);
        props.onClick = LinkUtility.getOnClick(this.getStateNavigator(), this.props, this.state.link);
        LinkUtility.setActive(this.state.active, this.props, props);
        return React.createElement("a", __assign$1({}, props), this.props.children);
    };
    RefreshLink.contextTypes = {
        stateNavigator: function () { return null; }
    };
    return RefreshLink;
}(React.Component));

var RefreshLink$1 = withStateNavigator(RefreshLink);

exports.NavigationContext = NavigationContext;
exports.NavigationHandler = NavigationHandler;
exports.NavigationBackLink = NavigationBackLink$1;
exports.NavigationLink = NavigationLink$1;
exports.RefreshLink = RefreshLink$1;

}((this.NavigationReact = this.NavigationReact || {}),Navigation,React));
