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
    LinkUtility.cloneProps = function (elem) {
        var props = {};
        for (var key in elem.props) {
            props[key] = elem.props[key];
        }
        return props;
    };
    LinkUtility.setLink = function (component, props, linkAccessor) {
        var _this = this;
        try {
            props.href = Navigation.settings.historyManager.getHref(linkAccessor());
            props.onClick = function (e) { return _this.onClick(e, component.getDOMNode()); };
        }
        catch (e) {
            props.href = null;
        }
    };
    LinkUtility.getData = function (toData, includeCurrentData, currentDataKeys) {
        if (currentDataKeys)
            toData = Navigation.StateContext.includeCurrentData(toData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            toData = Navigation.StateContext.includeCurrentData(toData);
        return toData;
    };
    LinkUtility.onClick = function (e, element) {
        if (!e.ctrlKey && !e.shiftKey) {
            if (element.href) {
                e.preventDefault();
                Navigation.StateController.navigateLink(Navigation.settings.historyManager.getUrl(element));
            }
        }
    };
    LinkUtility.createElement = function (props) {
        delete props.action;
        delete props.toData;
        delete props.includeCurrentData;
        delete props.currentDataKeys;
        delete props.distance;
        return React.createElement(props.href ? 'a' : 'span', props);
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
    componentDidMount: function () {
        Navigation.StateController.onNavigate(this.onNavigate);
    },
    componentWillUnmount: function () {
        Navigation.StateController.offNavigate(this.onNavigate);
    },
    render: function () {
        var props = LinkUtility.cloneProps(this);
        var distance = props.distance;
        LinkUtility.setLink(this, props, function () { return Navigation.StateController.getNavigationBackLink(distance); });
        return LinkUtility.createElement(props);
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
    componentDidMount: function () {
        Navigation.StateController.onNavigate(this.onNavigate);
    },
    componentWillUnmount: function () {
        Navigation.StateController.offNavigate(this.onNavigate);
    },
    render: function () {
        var props = LinkUtility.cloneProps(this);
        var action = props.action;
        var toData = LinkUtility.getData(props.toData, props.includeCurrentData, props.currentDataKeys);
        LinkUtility.setLink(this, props, function () { return Navigation.StateController.getNavigationLink(action, toData); });
        return LinkUtility.createElement(props);
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
    componentDidMount: function () {
        Navigation.StateController.onNavigate(this.onNavigate);
    },
    componentWillUnmount: function () {
        Navigation.StateController.offNavigate(this.onNavigate);
    },
    render: function () {
        var props = LinkUtility.cloneProps(this);
        var toData = LinkUtility.getData(props.toData, props.includeCurrentData, props.currentDataKeys);
        LinkUtility.setLink(this, props, function () { return Navigation.StateController.getRefreshLink(toData); });
        return LinkUtility.createElement(props);
    }
});
module.exports = RefreshLink;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":2}]},{},[1])(1)
});