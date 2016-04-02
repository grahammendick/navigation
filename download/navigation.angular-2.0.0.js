/**
 * Navigation Angular v2.0.0
 * (c) Graham Mendick - http://grahammendick.github.io/navigation/
 * License: Apache-2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NavigationAngular = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
var LinkUtility = (function () {
    function LinkUtility() {
    }
    LinkUtility.setLink = function (stateNavigator, element, attrs, linkAccessor) {
        try {
            attrs.$set('href', stateNavigator.historyManager.getHref(linkAccessor()));
        }
        catch (e) {
            attrs.$set('href', null);
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
    LinkUtility.setActive = function (element, attrs, active, activeCssClass, disableActive) {
        element.toggleClass(activeCssClass, active);
        if (active && disableActive)
            attrs.$set('href', null);
    };
    LinkUtility.addListeners = function (element, setLink, $parse, attrs, scope) {
        var _this = this;
        var lazy = !!scope.$eval(attrs['lazy']);
        var stateNavigator = scope.$eval(attrs['stateNavigator']);
        element.on('click', function (e) {
            var anchor = element[0];
            if (lazy)
                setLink();
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (anchor.href) {
                    var link = stateNavigator.historyManager.getUrl(anchor);
                    var navigating = _this.getNavigating($parse, attrs, scope);
                    if (navigating(e, link)) {
                        e.preventDefault();
                        stateNavigator.navigateLink(link, scope.$eval(attrs['historyAction']));
                    }
                }
            }
        });
        if (!lazy) {
            stateNavigator.onNavigate(setLink);
            element.on('$destroy', function () { return stateNavigator.offNavigate(setLink); });
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
}());
module.exports = LinkUtility;
},{}],2:[function(_dereq_,module,exports){
(function (global){
"use strict";
var NavigationBackLink = _dereq_('./NavigationBackLink');
var NavigationLink = _dereq_('./NavigationLink');
var RefreshLink = _dereq_('./RefreshLink');
var angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);
var NavigationAngular = (function () {
    function NavigationAngular() {
    }
    NavigationAngular.NavigationBackLink = NavigationBackLink;
    NavigationAngular.NavigationLink = NavigationLink;
    NavigationAngular.RefreshLink = RefreshLink;
    return NavigationAngular;
}());
angular.module('NavigationAngular', [])
    .directive('navigationBackLink', NavigationBackLink)
    .directive('navigationLink', NavigationLink)
    .directive('refreshLink', RefreshLink);
module.exports = NavigationAngular;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./NavigationBackLink":3,"./NavigationLink":4,"./RefreshLink":5}],3:[function(_dereq_,module,exports){
"use strict";
var LinkUtility = _dereq_('./LinkUtility');
var NavigationBackLink = function ($parse) {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            var distance;
            var stateNavigator = scope.$eval(attrs['stateNavigator']);
            LinkUtility.addListeners(element, function () { return setNavigationBackLink(element, attrs, stateNavigator, distance); }, $parse, attrs, scope);
            scope.$watch(attrs['navigationBackLink'], function (value) {
                distance = value;
                setNavigationBackLink(element, attrs, stateNavigator, distance);
            });
        }
    };
};
function setNavigationBackLink(element, attrs, stateNavigator, distance) {
    LinkUtility.setLink(stateNavigator, element, attrs, function () { return stateNavigator.getNavigationBackLink(distance); });
}
module.exports = NavigationBackLink;
},{"./LinkUtility":1}],4:[function(_dereq_,module,exports){
"use strict";
var LinkUtility = _dereq_('./LinkUtility');
var NavigationLink = function ($parse) {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            var stateKey, navigationData, includeCurrentData, currentDataKeys, activeCssClass, disableActive;
            var stateNavigator = scope.$eval(attrs['stateNavigator']);
            LinkUtility.addListeners(element, function () { return setNavigationLink(element, attrs, stateNavigator, stateKey, navigationData, includeCurrentData, currentDataKeys, activeCssClass, disableActive); }, $parse, attrs, scope);
            var watchAttrs = [attrs['navigationLink'], attrs['navigationData'], attrs['includeCurrentData'],
                attrs['currentDataKeys'], attrs['activeCssClass'], attrs['disableActive']];
            scope.$watchGroup(watchAttrs, function (values) {
                stateKey = values[0];
                navigationData = values[1];
                includeCurrentData = values[2];
                currentDataKeys = values[3];
                activeCssClass = values[4];
                disableActive = values[5];
                setNavigationLink(element, attrs, stateNavigator, stateKey, navigationData, includeCurrentData, currentDataKeys, activeCssClass, disableActive);
            });
        }
    };
};
function setNavigationLink(element, attrs, stateNavigator, stateKey, navigationData, includeCurrentData, currentDataKeys, activeCssClass, disableActive) {
    var active = true;
    for (var key in navigationData) {
        active = active && LinkUtility.isActive(stateNavigator, key, navigationData[key]);
    }
    LinkUtility.setLink(stateNavigator, element, attrs, function () { return stateNavigator.getNavigationLink(stateKey, LinkUtility.getData(stateNavigator, navigationData, includeCurrentData, currentDataKeys)); });
    active = active && !!attrs['href'] && stateNavigator.stateContext.state && stateNavigator.stateContext.state.key === stateKey;
    LinkUtility.setActive(element, attrs, active, activeCssClass, disableActive);
}
module.exports = NavigationLink;
},{"./LinkUtility":1}],5:[function(_dereq_,module,exports){
"use strict";
var LinkUtility = _dereq_('./LinkUtility');
var RefreshLink = function ($parse) {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            var navigationData, includeCurrentData, currentDataKeys, activeCssClass, disableActive;
            var stateNavigator = scope.$eval(attrs['stateNavigator']);
            LinkUtility.addListeners(element, function () { return setRefreshLink(element, attrs, stateNavigator, navigationData, includeCurrentData, currentDataKeys, activeCssClass, disableActive); }, $parse, attrs, scope);
            var watchAttrs = [attrs['refreshLink'], attrs['includeCurrentData'],
                attrs['currentDataKeys'], attrs['activeCssClass'], attrs['disableActive']];
            scope.$watchGroup(watchAttrs, function (values) {
                navigationData = values[0];
                includeCurrentData = values[1];
                currentDataKeys = values[2];
                activeCssClass = values[3];
                disableActive = values[4];
                setRefreshLink(element, attrs, stateNavigator, navigationData, includeCurrentData, currentDataKeys, activeCssClass, disableActive);
            });
        }
    };
};
function setRefreshLink(element, attrs, stateNavigator, navigationData, includeCurrentData, currentDataKeys, activeCssClass, disableActive) {
    var active = true;
    for (var key in navigationData) {
        active = active && LinkUtility.isActive(stateNavigator, key, navigationData[key]);
    }
    LinkUtility.setLink(stateNavigator, element, attrs, function () { return stateNavigator.getRefreshLink(LinkUtility.getData(stateNavigator, navigationData, includeCurrentData, currentDataKeys)); });
    active = active && !!attrs['href'];
    LinkUtility.setActive(element, attrs, active, activeCssClass, disableActive);
}
module.exports = RefreshLink;
},{"./LinkUtility":1}]},{},[2])(2)
});