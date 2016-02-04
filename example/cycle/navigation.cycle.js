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
var HistoryActionHook = (function () {
    function HistoryActionHook(historyAction) {
        this.historyAction = historyAction;
    }
    HistoryActionHook.prototype.hook = function (node) {
        node['historyAction'] = this.historyAction;
    };
    return HistoryActionHook;
})();
var LinkUtility = (function () {
    function LinkUtility() {
    }
    LinkUtility.getData = function (stateController, toData, includeCurrentData, currentDataKeys) {
        if (currentDataKeys)
            toData = stateController.stateContext.includeCurrentData(toData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            toData = stateController.stateContext.includeCurrentData(toData);
        return toData;
    };
    LinkUtility.isActive = function (stateController, key, val) {
        if (!stateController.stateContext.state)
            return false;
        if (val != null) {
            var trackTypes = stateController.stateContext.state.trackTypes;
            var currentVal = stateController.stateContext.data[key];
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
    LinkUtility.setHistoryAction = function (properties, historyAction) {
        if (historyAction)
            properties.historyAction = new HistoryActionHook(historyAction);
    };
    LinkUtility.getHistoryAction = function (properties) {
        var historyAction = properties.historyAction;
        if (typeof historyAction === 'string')
            historyAction = Navigation.HistoryAction[historyAction];
        return historyAction;
    };
    return LinkUtility;
})();
module.exports = LinkUtility;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
(function (global){
var LinkUtility = _dereq_('./LinkUtility');
var CycleDOM = (typeof window !== "undefined" ? window['CycleDOM'] : typeof global !== "undefined" ? global['CycleDOM'] : null);
var NavigationBackLink = function (stateController, properties, children) {
    var newProperties = {};
    for (var key in properties)
        newProperties[key] = properties[key];
    var link = stateController.getNavigationBackLink(properties.distance);
    newProperties.href = stateController.settings.historyManager.getHref(link);
    LinkUtility.setHistoryAction(newProperties, properties.historyAction);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
};
module.exports = NavigationBackLink;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":1}],3:[function(_dereq_,module,exports){
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
var LinkUtility = _dereq_('./LinkUtility');
var NavigationBackLink = _dereq_('./NavigationBackLink');
var NavigationLink = _dereq_('./NavigationLink');
var RefreshLink = _dereq_('./RefreshLink');
var Rx = (typeof window !== "undefined" ? window['Rx'] : typeof global !== "undefined" ? global['Rx'] : null);
function navigate(e, stateController) {
    var historyAction = LinkUtility.getHistoryAction(e);
    var toData = LinkUtility.getData(stateController, e.toData, e.includeCurrentData, e.currentDataKeys);
    if (e.action)
        stateController.navigate(e.action, toData, historyAction);
    if (!e.action && e.toData)
        stateController.refresh(toData, historyAction);
    if (e.distance)
        stateController.navigateBack(e.distance, historyAction);
    if (e.url)
        stateController.navigateLink(e.url, false, historyAction);
}
function isolate(NavigationSource, key) {
    var navigated$ = NavigationSource.navigated
        .filter(function (context) { return context.state.parent.index + '-' + context.state.index === key; });
    return {
        navigated: navigated$,
        navigationBackLink: NavigationSource.navigationBackLink,
        navigationLink: NavigationSource.navigationLink,
        refreshLink: NavigationSource.refreshLink
    };
}
var NavigationDriver = function (url) {
    return function (navigate$) {
        var stateController;
        var navigated$ = new Rx.ReplaySubject(1);
        navigate$.subscribe(function (e) {
            if (e.stateController) {
                stateController = e.stateController;
                stateController.onNavigate(function () { return navigated$.onNext({
                    state: stateController.stateContext.state,
                    data: stateController.stateContext.data
                }); });
                stateController.start(url);
            }
            if (e.target) {
                if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                    e.preventDefault();
                    var link = stateController.settings.historyManager.getUrl(e.target);
                    stateController.navigateLink(link, false, LinkUtility.getHistoryAction(e.target));
                }
            }
            else {
                navigate(e, stateController);
            }
        });
        return {
            navigated: navigated$,
            isolateSource: isolate,
            navigationBackLink: function (properties, children) { return NavigationBackLink(stateController, properties, children); },
            navigationLink: function (properties, children) { return NavigationLink(stateController, properties, children); },
            refreshLink: function (properties, children) { return RefreshLink(stateController, properties, children); }
        };
    };
};
module.exports = NavigationDriver;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":1,"./NavigationBackLink":2,"./NavigationLink":5,"./RefreshLink":6}],5:[function(_dereq_,module,exports){
(function (global){
var LinkUtility = _dereq_('./LinkUtility');
var CycleDOM = (typeof window !== "undefined" ? window['CycleDOM'] : typeof global !== "undefined" ? global['CycleDOM'] : null);
function isActive(stateController, action) {
    var nextState = stateController.getNextState(action);
    return nextState === nextState.parent.initial && nextState.parent === stateController.stateContext.dialog;
}
var NavigationLink = function (stateController, properties, children) {
    var newProperties = {};
    for (var key in properties)
        newProperties[key] = properties[key];
    var active = true;
    for (var key in properties.toData) {
        active = active && LinkUtility.isActive(stateController, key, properties.toData[key]);
    }
    var toData = LinkUtility.getData(stateController, properties.toData, properties.includeCurrentData, properties.currentDataKeys);
    var link = stateController.getNavigationLink(properties.action, properties.toData);
    newProperties.href = stateController.settings.historyManager.getHref(link);
    active = active && !!newProperties.href && isActive(stateController, properties.action);
    LinkUtility.setActive(newProperties, active, properties.activeCssClass, properties.disableActive);
    LinkUtility.setHistoryAction(newProperties, properties.historyAction);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
};
module.exports = NavigationLink;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":1}],6:[function(_dereq_,module,exports){
(function (global){
var LinkUtility = _dereq_('./LinkUtility');
var CycleDOM = (typeof window !== "undefined" ? window['CycleDOM'] : typeof global !== "undefined" ? global['CycleDOM'] : null);
var RefreshLink = function (stateController, properties, children) {
    var newProperties = {};
    for (var key in properties)
        newProperties[key] = properties[key];
    var active = true;
    for (var key in properties.toData) {
        active = active && LinkUtility.isActive(stateController, key, properties.toData[key]);
    }
    var toData = LinkUtility.getData(stateController, properties.toData, properties.includeCurrentData, properties.currentDataKeys);
    var link = stateController.getRefreshLink(toData);
    newProperties.href = stateController.settings.historyManager.getHref(link);
    active = active && !!newProperties.href;
    LinkUtility.setActive(newProperties, active, properties.activeCssClass, properties.disableActive);
    LinkUtility.setHistoryAction(newProperties, properties.historyAction);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
};
module.exports = RefreshLink;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":1}]},{},[3])(3)
});