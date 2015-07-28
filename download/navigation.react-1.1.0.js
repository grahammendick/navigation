/**
 * Navigation v1.1.0
 * (c) Graham Mendick - http://grahammendick.github.io/navigation/example/react/navigation.html
 * License: Apache License 2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NavigationReact = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

},{"./NavigationBackLink":3,"./NavigationLink":4,"./RefreshLink":5}],2:[function(_dereq_,module,exports){
(function (global){
var Navigation = (typeof window !== "undefined" ? window.Navigation : typeof global !== "undefined" ? global.Navigation : null);
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
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
        if (val != null && val.toString()) {
            var trackTypes = Navigation.StateContext.state.trackTypes;
            var currentVal = Navigation.StateContext.data[key];
            return currentVal != null && (trackTypes ? val === currentVal : val.toString() == currentVal.toString());
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
            var element = React.findDOMNode(component);
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
                        Navigation.StateController.navigateLink(link);
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
},{}],3:[function(_dereq_,module,exports){
(function (global){
var LinkUtility = _dereq_('./LinkUtility');
var Navigation = (typeof window !== "undefined" ? window.Navigation : typeof global !== "undefined" ? global.Navigation : null);
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var NavigationBackLink = React.createClass({
    onNavigate: function () {
        this.forceUpdate();
    },
    getNavigationBackLink: function () {
        var _this = this;
        return LinkUtility.getLink(function () { return Navigation.StateController.getNavigationBackLink(_this.props.distance); });
    },
    componentDidMount: function () {
        if (!this.props.lazy)
            Navigation.StateController.onNavigate(this.onNavigate);
    },
    componentWillUnmount: function () {
        if (!this.props.lazy)
            Navigation.StateController.offNavigate(this.onNavigate);
    },
    render: function () {
        var _this = this;
        var props = {};
        for (var key in this.props)
            props[key] = this.props[key];
        props.href = this.getNavigationBackLink();
        LinkUtility.addListeners(this, props, function () { return _this.getNavigationBackLink(); });
        return React.createElement(props.href ? 'a' : 'span', props);
    }
});
module.exports = NavigationBackLink;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":2}],4:[function(_dereq_,module,exports){
(function (global){
var LinkUtility = _dereq_('./LinkUtility');
var Navigation = (typeof window !== "undefined" ? window.Navigation : typeof global !== "undefined" ? global.Navigation : null);
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var NavigationLink = React.createClass({
    onNavigate: function () {
        this.forceUpdate();
    },
    getNavigationLink: function () {
        var _this = this;
        var toData = LinkUtility.getData(this.props.toData, this.props.includeCurrentData, this.props.currentDataKeys);
        return LinkUtility.getLink(function () { return Navigation.StateController.getNavigationLink(_this.props.action, toData); });
    },
    isActive: function (action) {
        var nextState = Navigation.StateController.getNextState(action);
        return nextState === nextState.parent.initial && nextState.parent === Navigation.StateContext.dialog;
    },
    componentDidMount: function () {
        if (!this.props.lazy)
            Navigation.StateController.onNavigate(this.onNavigate);
    },
    componentWillUnmount: function () {
        if (!this.props.lazy)
            Navigation.StateController.offNavigate(this.onNavigate);
    },
    render: function () {
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
    }
});
module.exports = NavigationLink;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":2}],5:[function(_dereq_,module,exports){
(function (global){
var LinkUtility = _dereq_('./LinkUtility');
var Navigation = (typeof window !== "undefined" ? window.Navigation : typeof global !== "undefined" ? global.Navigation : null);
var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var RefreshLink = React.createClass({
    onNavigate: function () {
        this.forceUpdate();
    },
    getRefreshLink: function () {
        var toData = LinkUtility.getData(this.props.toData, this.props.includeCurrentData, this.props.currentDataKeys);
        return LinkUtility.getLink(function () { return Navigation.StateController.getRefreshLink(toData); });
    },
    componentDidMount: function () {
        if (!this.props.lazy)
            Navigation.StateController.onNavigate(this.onNavigate);
    },
    componentWillUnmount: function () {
        if (!this.props.lazy)
            Navigation.StateController.offNavigate(this.onNavigate);
    },
    render: function () {
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
    }
});
module.exports = RefreshLink;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":2}]},{},[1])(1)
});