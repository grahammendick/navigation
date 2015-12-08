/**
 * Navigation v1.2.0
 * (c) Graham Mendick - http://grahammendick.github.io/navigation/example/react/navigation.html
 * License: Apache License 2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NavigationReact = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
/// <reference path="navigation.d.ts" />
/// <reference path="react.d.ts" />
/// <reference path="react-dom.d.ts" />
var Navigation = (typeof window !== "undefined" ? window['Navigation'] : typeof global !== "undefined" ? global['Navigation'] : null);
var ReactDOM = (typeof window !== "undefined" ? window['ReactDOM'] : typeof global !== "undefined" ? global['ReactDOM'] : null);
var LinkUtility = (function () {
    function LinkUtility() {
    }
    LinkUtility.getLink = function (linkAccessor) {
        try {
            return Navigation.settings.historyManager.getHref(linkAccessor());
        }
        catch (e) {
            return null;
        }
    };
    LinkUtility.getData = function (toData, includeCurrentData, currentDataKeys) {
        if (currentDataKeys)
            toData = Navigation.StateContext.includeCurrentData(toData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            toData = Navigation.StateContext.includeCurrentData(toData);
        return toData;
    };
    LinkUtility.isActive = function (key, val) {
        if (!Navigation.StateContext.state)
            return false;
        if (val != null) {
            var trackTypes = Navigation.StateContext.state.trackTypes;
            var currentVal = Navigation.StateContext.data[key];
            if (currentVal != null)
                return trackTypes ? val === currentVal : val.toString() == currentVal.toString();
            else
                return val === '';
        }
        return true;
    };
    LinkUtility.setActive = function (props, active, activeCssClass, disableActive) {
        if (active && activeCssClass)
            props.className = !props.className ? activeCssClass : props.className + ' ' + activeCssClass;
        if (active && disableActive)
            props.href = null;
    };
    LinkUtility.addListeners = function (component, props, getLink) {
        var _this = this;
        var lazy = !!props.lazy;
        props.onClick = function (e, domId) {
            var element = ReactDOM.findDOMNode(component);
            var href = element.href;
            if (lazy) {
                component.forceUpdate();
                href = getLink();
                if (href)
                    element.href = href;
            }
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (href) {
                    var link = Navigation.settings.historyManager.getUrl(element);
                    var navigating = _this.getNavigating(props);
                    if (navigating(e, domId, link)) {
                        e.preventDefault();
                        var historyAction = props.historyAction;
                        if (typeof historyAction === 'string')
                            historyAction = Navigation.HistoryAction[historyAction];
                        Navigation.StateController.navigateLink(link, false, historyAction);
                    }
                }
            }
        };
        if (lazy)
            props.onContextMenu = function (e) { return component.forceUpdate(); };
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
})();
module.exports = LinkUtility;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
(function (global){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LinkUtility = _dereq_('./LinkUtility');
var Navigation = (typeof window !== "undefined" ? window['Navigation'] : typeof global !== "undefined" ? global['Navigation'] : null);
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var NavigationBackLink = (function (_super) {
    __extends(NavigationBackLink, _super);
    function NavigationBackLink() {
        var _this = this;
        _super.apply(this, arguments);
        this.onNavigate = function () { return _this.forceUpdate(); };
    }
    NavigationBackLink.prototype.getNavigationBackLink = function () {
        var _this = this;
        return LinkUtility.getLink(function () { return Navigation.StateController.getNavigationBackLink(_this.props.distance); });
    };
    NavigationBackLink.prototype.componentDidMount = function () {
        if (!this.props.lazy)
            Navigation.StateController.onNavigate(this.onNavigate);
    };
    NavigationBackLink.prototype.componentWillUnmount = function () {
        if (!this.props.lazy)
            Navigation.StateController.offNavigate(this.onNavigate);
    };
    NavigationBackLink.prototype.render = function () {
        var _this = this;
        var props = {};
        for (var key in this.props)
            props[key] = this.props[key];
        props.href = this.getNavigationBackLink();
        LinkUtility.addListeners(this, props, function () { return _this.getNavigationBackLink(); });
        return React.createElement(props.href ? 'a' : 'span', props);
    };
    return NavigationBackLink;
})(React.Component);
;
module.exports = NavigationBackLink;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":1}],3:[function(_dereq_,module,exports){
(function (global){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LinkUtility = _dereq_('./LinkUtility');
var Navigation = (typeof window !== "undefined" ? window['Navigation'] : typeof global !== "undefined" ? global['Navigation'] : null);
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var NavigationLink = (function (_super) {
    __extends(NavigationLink, _super);
    function NavigationLink() {
        var _this = this;
        _super.apply(this, arguments);
        this.onNavigate = function () { return _this.forceUpdate(); };
    }
    NavigationLink.prototype.getNavigationLink = function () {
        var _this = this;
        var toData = LinkUtility.getData(this.props.toData, this.props.includeCurrentData, this.props.currentDataKeys);
        return LinkUtility.getLink(function () { return Navigation.StateController.getNavigationLink(_this.props.action, toData); });
    };
    NavigationLink.prototype.isActive = function (action) {
        var nextState = Navigation.StateController.getNextState(action);
        return nextState === nextState.parent.initial && nextState.parent === Navigation.StateContext.dialog;
    };
    NavigationLink.prototype.componentDidMount = function () {
        if (!this.props.lazy)
            Navigation.StateController.onNavigate(this.onNavigate);
    };
    NavigationLink.prototype.componentWillUnmount = function () {
        if (!this.props.lazy)
            Navigation.StateController.offNavigate(this.onNavigate);
    };
    NavigationLink.prototype.render = function () {
        var _this = this;
        var props = {};
        for (var key in this.props)
            props[key] = this.props[key];
        var active = true;
        for (var key in this.props.toData) {
            active = active && LinkUtility.isActive(key, this.props.toData[key]);
        }
        props.href = this.getNavigationLink();
        LinkUtility.addListeners(this, props, function () { return _this.getNavigationLink(); });
        active = active && !!props.href && this.isActive(this.props.action);
        LinkUtility.setActive(props, active, this.props.activeCssClass, this.props.disableActive);
        return React.createElement(props.href ? 'a' : 'span', props);
    };
    return NavigationLink;
})(React.Component);
;
module.exports = NavigationLink;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":1}],4:[function(_dereq_,module,exports){
var NavigationBackLink = _dereq_('./NavigationBackLink');
var NavigationLink = _dereq_('./NavigationLink');
var RefreshLink = _dereq_('./RefreshLink');
var NavigationReact = (function () {
    function NavigationReact() {
    }
    NavigationReact.NavigationBackLink = NavigationBackLink;
    NavigationReact.NavigationLink = NavigationLink;
    NavigationReact.RefreshLink = RefreshLink;
    return NavigationReact;
})();
module.exports = NavigationReact;
},{"./NavigationBackLink":2,"./NavigationLink":3,"./RefreshLink":5}],5:[function(_dereq_,module,exports){
(function (global){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LinkUtility = _dereq_('./LinkUtility');
var Navigation = (typeof window !== "undefined" ? window['Navigation'] : typeof global !== "undefined" ? global['Navigation'] : null);
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var RefreshLink = (function (_super) {
    __extends(RefreshLink, _super);
    function RefreshLink() {
        var _this = this;
        _super.apply(this, arguments);
        this.onNavigate = function () { return _this.forceUpdate(); };
    }
    RefreshLink.prototype.getRefreshLink = function () {
        var toData = LinkUtility.getData(this.props.toData, this.props.includeCurrentData, this.props.currentDataKeys);
        return LinkUtility.getLink(function () { return Navigation.StateController.getRefreshLink(toData); });
    };
    RefreshLink.prototype.componentDidMount = function () {
        if (!this.props.lazy)
            Navigation.StateController.onNavigate(this.onNavigate);
    };
    RefreshLink.prototype.componentWillUnmount = function () {
        if (!this.props.lazy)
            Navigation.StateController.offNavigate(this.onNavigate);
    };
    RefreshLink.prototype.render = function () {
        var _this = this;
        var props = {};
        for (var key in this.props)
            props[key] = this.props[key];
        var active = true;
        for (var key in this.props.toData) {
            active = active && LinkUtility.isActive(key, this.props.toData[key]);
        }
        props.href = this.getRefreshLink();
        LinkUtility.addListeners(this, props, function () { return _this.getRefreshLink(); });
        active = active && !!props.href;
        LinkUtility.setActive(props, active, this.props.activeCssClass, this.props.disableActive);
        return React.createElement(props.href ? 'a' : 'span', props);
    };
    return RefreshLink;
})(React.Component);
;
module.exports = RefreshLink;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":1}]},{},[4])(4)
});