/**
 * Navigation v1.1.0
 * (c) Graham Mendick - http://grahammendick.github.io/navigation/example/knockout/navigation.html
 * License: Apache License 2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NavigationKnockout = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var NavigationBackLink = _dereq_('./NavigationBackLink');
var NavigationLink = _dereq_('./NavigationLink');
var RefreshLink = _dereq_('./RefreshLink');
var NavigationKnockout = (function () {
    function NavigationKnockout() {
    }
    NavigationKnockout.NavigationBackLink = NavigationBackLink;
    NavigationKnockout.NavigationLink = NavigationLink;
    NavigationKnockout.RefreshLink = RefreshLink;
    return NavigationKnockout;
})();
module.exports = NavigationKnockout;

},{"./NavigationBackLink":3,"./NavigationLink":4,"./RefreshLink":5}],2:[function(_dereq_,module,exports){
(function (global){
var Navigation = (typeof window !== "undefined" ? window.Navigation : typeof global !== "undefined" ? global.Navigation : null);
var ko = (typeof window !== "undefined" ? window.ko : typeof global !== "undefined" ? global.ko : null);
var LinkUtility = (function () {
    function LinkUtility() {
    }
    LinkUtility.setLink = function (element, linkAccessor) {
        try {
            element.href = Navigation.settings.historyManager.getHref(linkAccessor());
        }
        catch (e) {
            element.removeAttribute('href');
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
    LinkUtility.setActive = function (element, active, activeCssClass, disableActive) {
        ko.utils.toggleDomNodeCssClass(element, activeCssClass, active);
        if (active && disableActive)
            element.removeAttribute('href');
    };
    LinkUtility.addListeners = function (element, setLink, allBindings, viewModel) {
        var _this = this;
        var lazy = !!allBindings.get('lazy');
        ko.utils.registerEventHandler(element, 'click', function (e) {
            if (lazy)
                setLink();
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (element.href) {
                    var link = Navigation.settings.historyManager.getUrl(element);
                    var navigating = _this.getNavigating(allBindings, viewModel);
                    if (navigating(e, link)) {
                        if (e.preventDefault)
                            e.preventDefault();
                        else
                            e['returnValue'] = false;
                        Navigation.StateController.navigateLink(link);
                    }
                }
            }
        });
        if (!lazy) {
            Navigation.StateController.onNavigate(setLink);
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () { return Navigation.StateController.offNavigate(setLink); });
        }
        else {
            ko.utils.registerEventHandler(element, 'mousedown', function (e) { return setLink(); });
            ko.utils.registerEventHandler(element, 'contextmenu', function (e) { return setLink(); });
        }
    };
    LinkUtility.getNavigating = function (allBindings, viewModel) {
        return function (e, link) {
            var listener = ko.unwrap(allBindings.get('navigating'));
            if (listener)
                return listener.call(viewModel, viewModel, e, link);
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
var ko = (typeof window !== "undefined" ? window.ko : typeof global !== "undefined" ? global.ko : null);
var NavigationBackLink = ko.bindingHandlers['navigationBackLink'] = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        LinkUtility.addListeners(element, function () { return setNavigationBackLink(element, valueAccessor); }, allBindings, viewModel);
    },
    update: function (element, valueAccessor) {
        setNavigationBackLink(element, valueAccessor);
    }
};
function setNavigationBackLink(element, valueAccessor) {
    LinkUtility.setLink(element, function () { return Navigation.StateController.getNavigationBackLink(ko.unwrap(valueAccessor())); });
}
module.exports = NavigationBackLink;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":2}],4:[function(_dereq_,module,exports){
(function (global){
var LinkUtility = _dereq_('./LinkUtility');
var Navigation = (typeof window !== "undefined" ? window.Navigation : typeof global !== "undefined" ? global.Navigation : null);
var ko = (typeof window !== "undefined" ? window.ko : typeof global !== "undefined" ? global.ko : null);
var NavigationLink = ko.bindingHandlers['navigationLink'] = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        LinkUtility.addListeners(element, function () { return setNavigationLink(element, valueAccessor, allBindings); }, allBindings, viewModel);
    },
    update: function (element, valueAccessor, allBindings) {
        setNavigationLink(element, valueAccessor, allBindings);
    }
};
function setNavigationLink(element, valueAccessor, allBindings) {
    var action = ko.unwrap(valueAccessor());
    var data = {};
    var toData = ko.unwrap(allBindings.get('toData'));
    var active = true;
    for (var key in toData) {
        var val = ko.unwrap(toData[key]);
        data[key] = val;
        active = active && LinkUtility.isActive(key, val);
    }
    LinkUtility.setLink(element, function () { return Navigation.StateController.getNavigationLink(action, LinkUtility.getData(data, ko.unwrap(allBindings.get('includeCurrentData')), ko.unwrap(allBindings.get('currentDataKeys')))); });
    active = active && !!element.href && isActive(action);
    LinkUtility.setActive(element, active, ko.unwrap(allBindings.get('activeCssClass')), ko.unwrap(allBindings.get('disableActive')));
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
var ko = (typeof window !== "undefined" ? window.ko : typeof global !== "undefined" ? global.ko : null);
var RefreshLink = ko.bindingHandlers['refreshLink'] = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        LinkUtility.addListeners(element, function () { return setRefreshLink(element, valueAccessor, allBindings); }, allBindings, viewModel);
    },
    update: function (element, valueAccessor, allBindings) {
        setRefreshLink(element, valueAccessor, allBindings);
    }
};
function setRefreshLink(element, valueAccessor, allBindings) {
    var data = {};
    var toData = ko.unwrap(valueAccessor());
    var active = true;
    for (var key in toData) {
        var val = ko.unwrap(toData[key]);
        data[key] = val;
        active = active && LinkUtility.isActive(key, val);
    }
    LinkUtility.setLink(element, function () { return Navigation.StateController.getRefreshLink(LinkUtility.getData(data, ko.unwrap(allBindings.get('includeCurrentData')), ko.unwrap(allBindings.get('currentDataKeys')))); });
    active = active && !!element.href;
    LinkUtility.setActive(element, active, ko.unwrap(allBindings.get('activeCssClass')), ko.unwrap(allBindings.get('disableActive')));
}
module.exports = RefreshLink;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":2}]},{},[1])(1)
});