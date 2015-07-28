/**
 * Navigation v1.1.0
 * (c) Graham Mendick - http://grahammendick.github.io/navigation/example/angular/navigation.html
 * License: Apache License 2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NavigationAngular = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
var NavigationBackLink = _dereq_('./NavigationBackLink');
var NavigationLink = _dereq_('./NavigationLink');
var RefreshLink = _dereq_('./RefreshLink');
var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);
var NavigationAngular = (function () {
    function NavigationAngular() {
    }
    NavigationAngular.NavigationBackLink = NavigationBackLink;
    NavigationAngular.NavigationLink = NavigationLink;
    NavigationAngular.RefreshLink = RefreshLink;
    return NavigationAngular;
})();
angular.module('NavigationAngular', []).directive('navigationBackLink', NavigationBackLink).directive('navigationLink', NavigationLink).directive('refreshLink', RefreshLink);
module.exports = NavigationAngular;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./NavigationBackLink":3,"./NavigationLink":4,"./RefreshLink":5}],2:[function(_dereq_,module,exports){
(function (global){
var Navigation = (typeof window !== "undefined" ? window.Navigation : typeof global !== "undefined" ? global.Navigation : null);
var LinkUtility = (function () {
    function LinkUtility() {
    }
    LinkUtility.setLink = function (element, attrs, linkAccessor) {
        try {
            attrs.$set('href', Navigation.settings.historyManager.getHref(linkAccessor()));
        }
        catch (e) {
            attrs.$set('href', null);
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
    LinkUtility.setActive = function (element, attrs, active, activeCssClass, disableActive) {
        element.toggleClass(activeCssClass, active);
        if (active && disableActive)
            attrs.$set('href', null);
    };
    LinkUtility.addListeners = function (element, setLink, $parse, attrs, scope) {
        var _this = this;
        var lazy = !!scope.$eval(attrs['lazy']);
        element.on('click', function (e) {
            var anchor = element[0];
            if (lazy)
                setLink();
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (anchor.href) {
                    var link = Navigation.settings.historyManager.getUrl(anchor);
                    var navigating = _this.getNavigating($parse, attrs, scope);
                    if (navigating(e, link)) {
                        e.preventDefault();
                        Navigation.StateController.navigateLink(link);
                    }
                }
            }
        });
        if (!lazy) {
            Navigation.StateController.onNavigate(setLink);
            element.on('$destroy', function () { return Navigation.StateController.offNavigate(setLink); });
        }
        else {
            element.on('mousedown', function (e) { return setLink(); });
            element.on('contextmenu', function (e) { return setLink(); });
        }
    };
    LinkUtility.getNavigating = function ($parse, attrs, scope) {
        return function (e, link) {
            var listener = attrs['navigating'] ? $parse(attrs['navigating']) : null;
            if (listener)
                return listener(scope, { $event: e, url: link });
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
var NavigationBackLink = function ($parse) {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            var distance;
            LinkUtility.addListeners(element, function () { return setNavigationBackLink(element, attrs, distance); }, $parse, attrs, scope);
            scope.$watch(attrs['navigationBackLink'], function (value) {
                distance = value;
                setNavigationBackLink(element, attrs, distance);
            });
        }
    };
};
function setNavigationBackLink(element, attrs, distance) {
    LinkUtility.setLink(element, attrs, function () { return Navigation.StateController.getNavigationBackLink(distance); });
}
module.exports = NavigationBackLink;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":2}],4:[function(_dereq_,module,exports){
(function (global){
var LinkUtility = _dereq_('./LinkUtility');
var Navigation = (typeof window !== "undefined" ? window.Navigation : typeof global !== "undefined" ? global.Navigation : null);
var NavigationLink = function ($parse) {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            var action, toData, includeCurrentData, currentDataKeys, activeCssClass, disableActive;
            LinkUtility.addListeners(element, function () { return setNavigationLink(element, attrs, action, toData, includeCurrentData, currentDataKeys, activeCssClass, disableActive); }, $parse, attrs, scope);
            var watchAttrs = [attrs['navigationLink'], attrs['toData'], attrs['includeCurrentData'], attrs['currentDataKeys'], attrs['activeCssClass'], attrs['disableActive']];
            scope.$watchGroup(watchAttrs, function (values) {
                action = values[0];
                toData = values[1];
                includeCurrentData = values[2];
                currentDataKeys = values[3];
                activeCssClass = values[4];
                disableActive = values[5];
                setNavigationLink(element, attrs, action, toData, includeCurrentData, currentDataKeys, activeCssClass, disableActive);
            });
        }
    };
};
function setNavigationLink(element, attrs, action, toData, includeCurrentData, currentDataKeys, activeCssClass, disableActive) {
    var active = true;
    for (var key in toData) {
        active = active && LinkUtility.isActive(key, toData[key]);
    }
    LinkUtility.setLink(element, attrs, function () { return Navigation.StateController.getNavigationLink(action, LinkUtility.getData(toData, includeCurrentData, currentDataKeys)); });
    active = active && !!attrs['href'] && isActive(action);
    LinkUtility.setActive(element, attrs, active, activeCssClass, disableActive);
}
function isActive(action) {
    var nextState = Navigation.StateController.getNextState(action);
    return nextState === nextState.parent.initial && nextState.parent === Navigation.StateContext.dialog;
}
module.exports = NavigationLink;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":2}],5:[function(_dereq_,module,exports){
(function (global){
var LinkUtility = _dereq_('./LinkUtility');
var Navigation = (typeof window !== "undefined" ? window.Navigation : typeof global !== "undefined" ? global.Navigation : null);
var RefreshLink = function ($parse) {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            var toData, includeCurrentData, currentDataKeys, activeCssClass, disableActive;
            LinkUtility.addListeners(element, function () { return setRefreshLink(element, attrs, toData, includeCurrentData, currentDataKeys, activeCssClass, disableActive); }, $parse, attrs, scope);
            var watchAttrs = [attrs['refreshLink'], attrs['includeCurrentData'], attrs['currentDataKeys'], attrs['activeCssClass'], attrs['disableActive']];
            scope.$watchGroup(watchAttrs, function (values) {
                toData = values[0];
                includeCurrentData = values[1];
                currentDataKeys = values[2];
                activeCssClass = values[3];
                disableActive = values[4];
                setRefreshLink(element, attrs, toData, includeCurrentData, currentDataKeys, activeCssClass, disableActive);
            });
        }
    };
};
function setRefreshLink(element, attrs, toData, includeCurrentData, currentDataKeys, activeCssClass, disableActive) {
    var active = true;
    for (var key in toData) {
        active = active && LinkUtility.isActive(key, toData[key]);
    }
    LinkUtility.setLink(element, attrs, function () { return Navigation.StateController.getRefreshLink(LinkUtility.getData(toData, includeCurrentData, currentDataKeys)); });
    active = active && !!attrs['href'];
    LinkUtility.setActive(element, attrs, active, activeCssClass, disableActive);
}
module.exports = RefreshLink;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":2}]},{},[1])(1)
});