/**
 * Navigation React v2.0.5
 * (c) Graham Mendick - http://grahammendick.github.io/navigation/
 * License: Apache-2.0
 */
(function (exports,React) {
'use strict';




var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}



















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

var LinkUtility = (function () {
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
            && attr !== 'navigating' && attr !== 'children';
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

var NavigationBackLink = (function (_super) {
    __extends(NavigationBackLink, _super);
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
        return this.props.stateNavigator || this.context.stateNavigator;
    };
    NavigationBackLink.prototype.componentDidMount = function () {
        this.getStateNavigator().onNavigate(this.onNavigate);
    };
    NavigationBackLink.prototype.componentWillReceiveProps = function (nextProps) {
        this.setState(this.getComponentState(nextProps));
    };
    NavigationBackLink.prototype.componentWillUnmount = function () {
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
        return React.createElement('a', props, this.props.children);
    };
    NavigationBackLink.contextTypes = {
        stateNavigator: function () { }
    };
    return NavigationBackLink;
}(React.Component));

var NavigationLink = (function (_super) {
    __extends(NavigationLink, _super);
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
        return this.props.stateNavigator || this.context.stateNavigator;
    };
    NavigationLink.prototype.componentDidMount = function () {
        this.getStateNavigator().onNavigate(this.onNavigate);
    };
    NavigationLink.prototype.componentWillReceiveProps = function (nextProps) {
        this.setState(this.getComponentState(nextProps));
    };
    NavigationLink.prototype.componentWillUnmount = function () {
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
        return React.createElement('a', props, this.props.children);
    };
    NavigationLink.contextTypes = {
        stateNavigator: function () { }
    };
    return NavigationLink;
}(React.Component));

var RefreshLink = (function (_super) {
    __extends(RefreshLink, _super);
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
        return this.props.stateNavigator || this.context.stateNavigator;
    };
    RefreshLink.prototype.componentDidMount = function () {
        this.getStateNavigator().onNavigate(this.onNavigate);
    };
    RefreshLink.prototype.componentWillReceiveProps = function (nextProps) {
        this.setState(this.getComponentState(nextProps));
    };
    RefreshLink.prototype.componentWillUnmount = function () {
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
        return React.createElement('a', props, this.props.children);
    };
    RefreshLink.contextTypes = {
        stateNavigator: function () { }
    };
    return RefreshLink;
}(React.Component));

exports.NavigationBackLink = NavigationBackLink;
exports.NavigationLink = NavigationLink;
exports.RefreshLink = RefreshLink;

}((this.NavigationReact = this.NavigationReact || {}),React));
