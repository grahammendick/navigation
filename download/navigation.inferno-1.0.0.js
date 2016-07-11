/**
 * Navigation Inferno v1.0.0
 * (c) Graham Mendick - http://grahammendick.github.io/navigation/
 * License: Apache-2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NavigationInferno = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
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
    LinkUtility.isActive = function (stateNavigator, key, val) {
        if (!stateNavigator.stateContext.state)
            return false;
        if (val != null) {
            var trackTypes = stateNavigator.stateContext.state.trackTypes;
            var currentVal = stateNavigator.stateContext.data[key];
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
    LinkUtility.isValidAttribute = function (attr) {
        return attr !== 'stateNavigator' && attr !== 'stateKey' && attr !== 'navigationData' && attr !== 'includeCurrentData'
            && attr !== 'currentDataKeys' && attr !== 'activeCssClass' && attr !== 'disableActive' && attr !== 'distance'
            && attr !== 'lazy' && attr !== 'historyAction' && attr !== 'navigating' && attr !== 'children';
    };
    LinkUtility.addListeners = function (component, stateNavigator, props, toProps, getLink) {
        var _this = this;
        var lazy = !!props.lazy;
        toProps.onClick = function (e, domId) {
            var element = component.refs.el;
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
module.exports = LinkUtility;
},{}],2:[function(_dereq_,module,exports){
(function (global){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LinkUtility = _dereq_('./LinkUtility');
var InfernoComponent = (typeof window !== "undefined" ? window['InfernoComponent'] : typeof global !== "undefined" ? global['InfernoComponent'] : null);
var createElement = (typeof window !== "undefined" ? window['InfernoCreateElement'] : typeof global !== "undefined" ? global['InfernoCreateElement'] : null);
var NavigationBackLink = (function (_super) {
    __extends(NavigationBackLink, _super);
    function NavigationBackLink() {
        var _this = this;
        _super.apply(this, arguments);
        this.onNavigate = function () { return _this.forceUpdate(); };
    }
    NavigationBackLink.prototype.getStateNavigator = function () {
        return this.props.stateNavigator || this.context.stateNavigator;
    };
    NavigationBackLink.prototype.getNavigationBackLink = function () {
        var _this = this;
        return LinkUtility.getLink(this.getStateNavigator(), function () { return _this.getStateNavigator().getNavigationBackLink(_this.props.distance); });
    };
    NavigationBackLink.prototype.componentDidMount = function () {
        if (!this.props.lazy)
            this.getStateNavigator().onNavigate(this.onNavigate);
    };
    NavigationBackLink.prototype.componentWillUnmount = function () {
        if (!this.props.lazy)
            this.getStateNavigator().offNavigate(this.onNavigate);
    };
    NavigationBackLink.prototype.render = function () {
        var _this = this;
        var props = { ref: 'el' };
        for (var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        props.href = this.getNavigationBackLink();
        LinkUtility.addListeners(this, this.getStateNavigator(), this.props, props, function () { return _this.getNavigationBackLink(); });
        return createElement('a', props, this.props.children);
    };
    return NavigationBackLink;
}(InfernoComponent));
;
module.exports = NavigationBackLink;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":1}],3:[function(_dereq_,module,exports){
"use strict";
var NavigationBackLink = _dereq_('./NavigationBackLink');
var NavigationLink = _dereq_('./NavigationLink');
var RefreshLink = _dereq_('./RefreshLink');
var NavigationInferno = (function () {
    function NavigationInferno() {
    }
    NavigationInferno.NavigationBackLink = NavigationBackLink;
    NavigationInferno.NavigationLink = NavigationLink;
    NavigationInferno.RefreshLink = RefreshLink;
    return NavigationInferno;
}());
module.exports = NavigationInferno;
},{"./NavigationBackLink":2,"./NavigationLink":4,"./RefreshLink":5}],4:[function(_dereq_,module,exports){
(function (global){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LinkUtility = _dereq_('./LinkUtility');
var InfernoComponent = (typeof window !== "undefined" ? window['InfernoComponent'] : typeof global !== "undefined" ? global['InfernoComponent'] : null);
var createElement = (typeof window !== "undefined" ? window['InfernoCreateElement'] : typeof global !== "undefined" ? global['InfernoCreateElement'] : null);
var NavigationLink = (function (_super) {
    __extends(NavigationLink, _super);
    function NavigationLink() {
        var _this = this;
        _super.apply(this, arguments);
        this.onNavigate = function () { return _this.forceUpdate(); };
    }
    NavigationLink.prototype.getStateNavigator = function () {
        return this.props.stateNavigator || this.context.stateNavigator;
    };
    NavigationLink.prototype.getNavigationLink = function () {
        var _this = this;
        var navigationData = LinkUtility.getData(this.getStateNavigator(), this.props.navigationData, this.props.includeCurrentData, this.props.currentDataKeys);
        return LinkUtility.getLink(this.getStateNavigator(), function () { return _this.getStateNavigator().getNavigationLink(_this.props.stateKey, navigationData); });
    };
    NavigationLink.prototype.componentDidMount = function () {
        if (!this.props.lazy)
            this.getStateNavigator().onNavigate(this.onNavigate);
    };
    NavigationLink.prototype.componentWillUnmount = function () {
        if (!this.props.lazy)
            this.getStateNavigator().offNavigate(this.onNavigate);
    };
    NavigationLink.prototype.render = function () {
        var _this = this;
        var props = { ref: 'el' };
        for (var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        var active = true;
        for (var key in this.props.navigationData) {
            active = active && LinkUtility.isActive(this.getStateNavigator(), key, this.props.navigationData[key]);
        }
        props.href = this.getNavigationLink();
        LinkUtility.addListeners(this, this.getStateNavigator(), this.props, props, function () { return _this.getNavigationLink(); });
        active = active && !!props.href && this.getStateNavigator().stateContext.state && this.getStateNavigator().stateContext.state.key === this.props.stateKey;
        LinkUtility.setActive(props, active, this.props.activeCssClass, this.props.disableActive);
        return createElement('a', props, this.props.children);
    };
    return NavigationLink;
}(InfernoComponent));
;
module.exports = NavigationLink;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":1}],5:[function(_dereq_,module,exports){
(function (global){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LinkUtility = _dereq_('./LinkUtility');
var InfernoComponent = (typeof window !== "undefined" ? window['InfernoComponent'] : typeof global !== "undefined" ? global['InfernoComponent'] : null);
var createElement = (typeof window !== "undefined" ? window['InfernoCreateElement'] : typeof global !== "undefined" ? global['InfernoCreateElement'] : null);
var RefreshLink = (function (_super) {
    __extends(RefreshLink, _super);
    function RefreshLink() {
        var _this = this;
        _super.apply(this, arguments);
        this.onNavigate = function () { return _this.forceUpdate(); };
    }
    RefreshLink.prototype.getStateNavigator = function () {
        return this.props.stateNavigator || this.context.stateNavigator;
    };
    RefreshLink.prototype.getRefreshLink = function () {
        var _this = this;
        var navigationData = LinkUtility.getData(this.getStateNavigator(), this.props.navigationData, this.props.includeCurrentData, this.props.currentDataKeys);
        return LinkUtility.getLink(this.getStateNavigator(), function () { return _this.getStateNavigator().getRefreshLink(navigationData); });
    };
    RefreshLink.prototype.componentDidMount = function () {
        if (!this.props.lazy)
            this.getStateNavigator().onNavigate(this.onNavigate);
    };
    RefreshLink.prototype.componentWillUnmount = function () {
        if (!this.props.lazy)
            this.getStateNavigator().offNavigate(this.onNavigate);
    };
    RefreshLink.prototype.render = function () {
        var _this = this;
        var props = { ref: 'el' };
        for (var key in this.props) {
            if (LinkUtility.isValidAttribute(key))
                props[key] = this.props[key];
        }
        var active = true;
        for (var key in this.props.navigationData) {
            active = active && LinkUtility.isActive(this.getStateNavigator(), key, this.props.navigationData[key]);
        }
        props.href = this.getRefreshLink();
        LinkUtility.addListeners(this, this.getStateNavigator(), this.props, props, function () { return _this.getRefreshLink(); });
        active = active && !!props.href;
        LinkUtility.setActive(props, active, this.props.activeCssClass, this.props.disableActive);
        return createElement('a', props, this.props.children);
    };
    return RefreshLink;
}(InfernoComponent));
;
module.exports = RefreshLink;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":1}]},{},[3])(3)
});