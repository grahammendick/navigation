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
    LinkUtility.addClickListener = function (element) {
        element.on('click', function (e) {
            var anchor = element[0];
            if (!e.ctrlKey && !e.shiftKey) {
                if (anchor.href) {
                    e.preventDefault();
                    Navigation.StateController.navigateLink(Navigation.settings.historyManager.getUrl(anchor));
                }
            }
        });
    };
    LinkUtility.addNavigateHandler = function (element, handler) {
        Navigation.StateController.onNavigate(handler);
        element.on('$destroy', function () { return Navigation.StateController.offNavigate(handler); });
    };
    return LinkUtility;
})();
module.exports = LinkUtility;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(_dereq_,module,exports){
(function (global){
var LinkUtility = _dereq_('./LinkUtility');
var Navigation = (typeof window !== "undefined" ? window.Navigation : typeof global !== "undefined" ? global.Navigation : null);
var NavigationBackLink = function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            var distance;
            LinkUtility.addClickListener(element);
            LinkUtility.addNavigateHandler(element, function () { return setNavigationBackLink(element, attrs, distance); });
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
var NavigationLink = function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            var action, toData, includeCurrentData, currentDataKeys;
            LinkUtility.addClickListener(element);
            LinkUtility.addNavigateHandler(element, function () { return setNavigationLink(element, attrs, action, toData, includeCurrentData, currentDataKeys); });
            var watchAttrs = [attrs['navigationLink'], attrs['toData'], attrs['includeCurrentData'], attrs['currentDataKeys']];
            scope.$watchGroup(watchAttrs, function (values) {
                action = values[0];
                toData = values[1];
                includeCurrentData = values[2];
                currentDataKeys = values[3];
                setNavigationLink(element, attrs, action, toData, includeCurrentData, currentDataKeys);
            });
        }
    };
};
function setNavigationLink(element, attrs, action, toData, includeCurrentData, currentDataKeys) {
    LinkUtility.setLink(element, attrs, function () { return Navigation.StateController.getNavigationLink(action, LinkUtility.getData(toData, includeCurrentData, currentDataKeys)); });
}
module.exports = NavigationLink;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":2}],5:[function(_dereq_,module,exports){
(function (global){
var LinkUtility = _dereq_('./LinkUtility');
var Navigation = (typeof window !== "undefined" ? window.Navigation : typeof global !== "undefined" ? global.Navigation : null);
var RefreshLink = function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            var toData, includeCurrentData, currentDataKeys;
            LinkUtility.addClickListener(element);
            LinkUtility.addNavigateHandler(element, function () { return setRefreshLink(element, attrs, toData, includeCurrentData, currentDataKeys); });
            var watchAttrs = [attrs['refreshLink'], attrs['includeCurrentData'], attrs['currentDataKeys']];
            scope.$watchGroup(watchAttrs, function (values) {
                toData = values[0];
                includeCurrentData = values[1];
                currentDataKeys = values[2];
                setRefreshLink(element, attrs, toData, includeCurrentData, currentDataKeys);
            });
        }
    };
};
function setRefreshLink(element, attrs, toData, includeCurrentData, currentDataKeys) {
    LinkUtility.setLink(element, attrs, function () { return Navigation.StateController.getRefreshLink(LinkUtility.getData(toData, includeCurrentData, currentDataKeys)); });
}
module.exports = RefreshLink;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":2}]},{},[1])(1)
});