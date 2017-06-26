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
    LinkUtility.getLink = function (stateNavigator, linkAccessor) {
        try {
            return stateNavigator.historyManager.getHref(linkAccessor());
        }
        catch (e) {
            return null;
        }
    };
    LinkUtility.getData = function (stateNavigator, navigationData, includeCurrentData, currentDataKeys) {
        if (currentDataKeys)
            navigationData = stateNavigator.stateContext.includeCurrentData(navigationData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            navigationData = stateNavigator.stateContext.includeCurrentData(navigationData);
        return navigationData;
    };
    LinkUtility.setActive = function (stateNavigator, props, toProps) {
        if (!props.activeCssClass && !props.disableActive)
            return;
        var active = !!toProps.href;
        for (var key in props.navigationData) {
            var val = props.navigationData[key];
            active = active && (val == null || this.areEqual(val, stateNavigator.stateContext.data[key]));
        }
        if (active && props.activeCssClass)
            toProps.className = !toProps.className ? props.activeCssClass : toProps.className + ' ' + props.activeCssClass;
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
        return attr !== 'stateNavigator' && attr !== 'stateKey' && attr !== 'navigationData' && attr !== 'includeCurrentData'
            && attr !== 'currentDataKeys' && attr !== 'activeCssClass' && attr !== 'disableActive' && attr !== 'distance'
            && attr !== 'lazy' && attr !== 'historyAction' && attr !== 'navigating' && attr !== 'children';
    };
    LinkUtility.addListeners = function (component, stateNavigator, props, toProps, getLink) {
        var _this = this;
        var lazy = !!props.lazy;
        toProps.onClick = function (e, domId) {
            var element = component['el'];
            var href = element.href;
            if (lazy) {
                component.forceUpdate();
                href = getLink();
                if (href)
                    element.href = href;
            }
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (href) {
                    var link = stateNavigator.historyManager.getUrl(element);
                    var navigating = _this.getNavigating(props);
                    if (navigating(e, domId, link)) {
                        e.preventDefault();
                        stateNavigator.navigateLink(link, props.historyAction);
                    }
                }
            }
        };
        if (lazy)
            toProps.onContextMenu = function (e) { return component.forceUpdate(); };
    };
    LinkUtility.getNavigating = function (props) {
        return function (e, domId, link) {
            var listener = props.navigating;
            if (listener)
                return listener(e, domId, link);
            return true;
        };
    };
    return LinkUtility;
}());

var NavigationBackLink = (function (_super) {
    __extends(NavigationBackLink, _super);
    function NavigationBackLink(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.onNavigate = function () {
            if (_this.state.stateContext !== _this.getStateNavigator().stateContext.url
                || _this.state.crumb !== _this.getNavigationBackLink())
                _this.setState(_this.getNextState());
        };
        _this.state = _this.getNextState();
        return _this;
    }
    NavigationBackLink.prototype.getStateNavigator = function () {
        return this.props.stateNavigator || this.context.stateNavigator;
    };
    NavigationBackLink.prototype.getNavigationBackLink = function () {
        var _this = this;
        return LinkUtility.getLink(this.getStateNavigator(), function () { return _this.getStateNavigator().getNavigationBackLink(_this.props.distance); });
    };
    NavigationBackLink.prototype.getNextState = function () {
        return {
            stateContext: this.getStateNavigator().stateContext.url,
            crumb: this.getNavigationBackLink()
        };
    };
    NavigationBackLink.prototype.componentDidMount = function () {
        if (!this.props.lazy)
            this.getStateNavigator().onNavigate(this.onNavigate);
    };
    NavigationBackLink.prototype.componentWillReceiveProps = function () {
        this.setState(this.getNextState());
    };
    NavigationBackLink.prototype.componentWillUnmount = function () {
        if (!this.props.lazy)
            this.getStateNavigator().offNavigate(this.onNavigate);
    };
    NavigationBackLink.prototype.render = function () {
        var _this = this;
        var props = { ref: function (el) { return _this['el'] = el; } };
        for (var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        props.href = this.getNavigationBackLink();
        LinkUtility.addListeners(this, this.getStateNavigator(), this.props, props, function () { return _this.getNavigationBackLink(); });
        return React.createElement('a', props, this.props.children);
    };
    return NavigationBackLink;
}(React.Component));
NavigationBackLink.contextTypes = {
    stateNavigator: function () { }
};

var NavigationLink = (function (_super) {
    __extends(NavigationLink, _super);
    function NavigationLink(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.onNavigate = function () {
            if (_this.state.stateContext !== _this.getStateNavigator().stateContext.url)
                _this.setState(_this.getNextState());
        };
        _this.state = _this.getNextState();
        return _this;
    }
    NavigationLink.prototype.getStateNavigator = function () {
        return this.props.stateNavigator || this.context.stateNavigator;
    };
    NavigationLink.prototype.getNavigationLink = function () {
        var _this = this;
        var navigationData = LinkUtility.getData(this.getStateNavigator(), this.props.navigationData, this.props.includeCurrentData, this.props.currentDataKeys);
        return LinkUtility.getLink(this.getStateNavigator(), function () { return _this.getStateNavigator().getNavigationLink(_this.props.stateKey, navigationData); });
    };
    NavigationLink.prototype.getNextState = function () {
        return { stateContext: this.getStateNavigator().stateContext.url };
    };
    NavigationLink.prototype.componentDidMount = function () {
        if (!this.props.lazy)
            this.getStateNavigator().onNavigate(this.onNavigate);
    };
    NavigationLink.prototype.componentWillReceiveProps = function () {
        this.setState(this.getNextState());
    };
    NavigationLink.prototype.componentWillUnmount = function () {
        if (!this.props.lazy)
            this.getStateNavigator().offNavigate(this.onNavigate);
    };
    NavigationLink.prototype.render = function () {
        var _this = this;
        var props = { ref: function (el) { return _this['el'] = el; } };
        for (var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        props.href = this.getNavigationLink();
        LinkUtility.addListeners(this, this.getStateNavigator(), this.props, props, function () { return _this.getNavigationLink(); });
        if (this.getStateNavigator().stateContext.state && this.getStateNavigator().stateContext.state.key === this.props.stateKey)
            LinkUtility.setActive(this.getStateNavigator(), this.props, props);
        return React.createElement('a', props, this.props.children);
    };
    return NavigationLink;
}(React.Component));
NavigationLink.contextTypes = {
    stateNavigator: function () { }
};

var RefreshLink = (function (_super) {
    __extends(RefreshLink, _super);
    function RefreshLink(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.onNavigate = function () {
            if (_this.state.stateContext !== _this.getStateNavigator().stateContext.url)
                _this.setState(_this.getNextState());
        };
        _this.state = _this.getNextState();
        return _this;
    }
    RefreshLink.prototype.getStateNavigator = function () {
        return this.props.stateNavigator || this.context.stateNavigator;
    };
    RefreshLink.prototype.getRefreshLink = function () {
        var _this = this;
        var navigationData = LinkUtility.getData(this.getStateNavigator(), this.props.navigationData, this.props.includeCurrentData, this.props.currentDataKeys);
        return LinkUtility.getLink(this.getStateNavigator(), function () { return _this.getStateNavigator().getRefreshLink(navigationData); });
    };
    RefreshLink.prototype.getNextState = function () {
        return { stateContext: this.getStateNavigator().stateContext.url };
    };
    RefreshLink.prototype.componentDidMount = function () {
        if (!this.props.lazy)
            this.getStateNavigator().onNavigate(this.onNavigate);
    };
    RefreshLink.prototype.componentWillReceiveProps = function () {
        this.setState(this.getNextState());
    };
    RefreshLink.prototype.componentWillUnmount = function () {
        if (!this.props.lazy)
            this.getStateNavigator().offNavigate(this.onNavigate);
    };
    RefreshLink.prototype.render = function () {
        var _this = this;
        var props = { ref: function (el) { return _this['el'] = el; } };
        for (var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        props.href = this.getRefreshLink();
        LinkUtility.addListeners(this, this.getStateNavigator(), this.props, props, function () { return _this.getRefreshLink(); });
        LinkUtility.setActive(this.getStateNavigator(), this.props, props);
        return React.createElement('a', props, this.props.children);
    };
    return RefreshLink;
}(React.Component));
RefreshLink.contextTypes = {
    stateNavigator: function () { }
};

exports.NavigationBackLink = NavigationBackLink;
exports.NavigationLink = NavigationLink;
exports.RefreshLink = RefreshLink;

}((this.NavigationReact = this.NavigationReact || {}),React));
