/**
 * Navigation v1.0.0
 * (c) Graham Mendick - http://grahammendick.github.io/navigation/example/cycle/navigation.html
 * License: Apache License 2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NavigationCycle = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
/// <reference path="navigation.d.ts" />
/// <reference path="cycle-dom.d.ts" />
/// <reference path="rx.d.ts" />
var Navigation = (typeof window !== "undefined" ? window['Navigation'] : typeof global !== "undefined" ? global['Navigation'] : null);
var LinkUtility = (function () {
    function LinkUtility() {
    }
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
    LinkUtility.setActive = function (properties, active, activeCssClass, disableActive) {
        if (active && activeCssClass)
            properties.className = !properties.className ? activeCssClass : properties.className + ' ' + activeCssClass;
        if (active && disableActive)
            properties.href = null;
    };
    return LinkUtility;
})();
module.exports = LinkUtility;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
(function (global){
var Navigation = (typeof window !== "undefined" ? window['Navigation'] : typeof global !== "undefined" ? global['Navigation'] : null);
var CycleDOM = (typeof window !== "undefined" ? window['CycleDOM'] : typeof global !== "undefined" ? global['CycleDOM'] : null);
var NavigationBackLink = function (properties, children) {
    var newProperties = {};
    for (var key in properties)
        newProperties[key] = properties[key];
    var link = Navigation.StateController.getNavigationBackLink(properties.distance);
    newProperties.href = Navigation.settings.historyManager.getHref(link);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
};
module.exports = NavigationBackLink;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(_dereq_,module,exports){
var NavigationDriver = _dereq_('./NavigationDriver');
var NavigationBackLink = _dereq_('./NavigationBackLink');
var NavigationLink = _dereq_('./NavigationLink');
var RefreshLink = _dereq_('./RefreshLink');
var NavigationCycle = (function () {
    function NavigationCycle() {
    }
    NavigationCycle.makeNavigationDriver = NavigationDriver;
    NavigationCycle.navigationBackLink = NavigationBackLink;
    NavigationCycle.navigationLink = NavigationLink;
    NavigationCycle.refreshLink = RefreshLink;
    return NavigationCycle;
})();
module.exports = NavigationCycle;
},{"./NavigationBackLink":2,"./NavigationDriver":4,"./NavigationLink":5,"./RefreshLink":6}],4:[function(_dereq_,module,exports){
(function (global){
var Navigation = (typeof window !== "undefined" ? window['Navigation'] : typeof global !== "undefined" ? global['Navigation'] : null);
var Rx = (typeof window !== "undefined" ? window['Rx'] : typeof global !== "undefined" ? global['Rx'] : null);
var NavigationDriver = function (url) {
    return function (navigate$) {
        navigate$.subscribe(function (e) {
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                e.preventDefault();
                var link = Navigation.settings.historyManager.getUrl(e.target);
                Navigation.StateController.navigateLink(link);
            }
        });
        var navigated$ = new Rx.BehaviorSubject();
        for (var dialogKey in Navigation.StateInfoConfig.dialogs) {
            var dialog = Navigation.StateInfoConfig.dialogs[dialogKey];
            for (var stateKey in dialog.states) {
                (function (state) { return state.navigated = function (data) {
                    navigated$.onNext({
                        state: state,
                        data: data
                    });
                }; })(dialog.states[stateKey]);
            }
        }
        Navigation.start(url);
        navigated$['isolateSource'] = function (NavigationSource, key) { return (NavigationSource.filter(function (navigated) { return navigated.state.parent.index + '-' + navigated.state.index === key; })); };
        return navigated$;
    };
};
module.exports = NavigationDriver;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(_dereq_,module,exports){
(function (global){
var LinkUtility = _dereq_('./LinkUtility');
var Navigation = (typeof window !== "undefined" ? window['Navigation'] : typeof global !== "undefined" ? global['Navigation'] : null);
var CycleDOM = (typeof window !== "undefined" ? window['CycleDOM'] : typeof global !== "undefined" ? global['CycleDOM'] : null);
function isActive(action) {
    var nextState = Navigation.StateController.getNextState(action);
    return nextState === nextState.parent.initial && nextState.parent === Navigation.StateContext.dialog;
}
var NavigationLink = function (properties, children) {
    var newProperties = {};
    for (var key in properties)
        newProperties[key] = properties[key];
    var active = true;
    for (var key in properties.toData) {
        active = active && LinkUtility.isActive(key, properties.toData[key]);
    }
    var toData = LinkUtility.getData(properties.toData, properties.includeCurrentData, properties.currentDataKeys);
    var link = Navigation.StateController.getNavigationLink(properties.action, properties.toData);
    newProperties.href = Navigation.settings.historyManager.getHref(link);
    active = active && !!newProperties.href && isActive(properties.action);
    LinkUtility.setActive(newProperties, active, properties.activeCssClass, properties.disableActive);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
};
module.exports = NavigationLink;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":1}],6:[function(_dereq_,module,exports){
(function (global){
var LinkUtility = _dereq_('./LinkUtility');
var Navigation = (typeof window !== "undefined" ? window['Navigation'] : typeof global !== "undefined" ? global['Navigation'] : null);
var CycleDOM = (typeof window !== "undefined" ? window['CycleDOM'] : typeof global !== "undefined" ? global['CycleDOM'] : null);
var RefreshLink = function (properties, children) {
    var newProperties = {};
    for (var key in properties)
        newProperties[key] = properties[key];
    var active = true;
    for (var key in properties.toData) {
        active = active && LinkUtility.isActive(key, properties.toData[key]);
    }
    var toData = LinkUtility.getData(properties.toData, properties.includeCurrentData, properties.currentDataKeys);
    var link = Navigation.StateController.getRefreshLink(toData);
    newProperties.href = Navigation.settings.historyManager.getHref(link);
    active = active && !!newProperties.href;
    LinkUtility.setActive(newProperties, active, properties.activeCssClass, properties.disableActive);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
};
module.exports = RefreshLink;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":1}]},{},[3])(3)
});