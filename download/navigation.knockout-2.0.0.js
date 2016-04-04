/**
 * Navigation Knockout v2.0.0
 * (c) Graham Mendick - http://grahammendick.github.io/navigation/
 * License: Apache-2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NavigationKnockout = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
"use strict";
var ko = (typeof window !== "undefined" ? window['ko'] : typeof global !== "undefined" ? global['ko'] : null);
var LinkUtility = (function () {
    function LinkUtility() {
    }
    LinkUtility.setLink = function (stateNavigator, element, linkAccessor) {
        try {
            element.href = stateNavigator.historyManager.getHref(linkAccessor());
        }
        catch (e) {
            element.removeAttribute('href');
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
    LinkUtility.setActive = function (element, active, activeCssClass, disableActive) {
        ko.utils.toggleDomNodeCssClass(element, activeCssClass, active);
        if (active && disableActive)
            element.removeAttribute('href');
    };
    LinkUtility.addListeners = function (element, setLink, allBindings, viewModel) {
        var _this = this;
        var lazy = !!allBindings.get('lazy');
        var stateNavigator = allBindings.get('stateNavigator');
        ko.utils.registerEventHandler(element, 'click', function (e) {
            if (lazy)
                setLink();
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (element.href) {
                    var link = stateNavigator.historyManager.getUrl(element);
                    var navigating = _this.getNavigating(allBindings, viewModel);
                    if (navigating(e, link)) {
                        if (e.preventDefault)
                            e.preventDefault();
                        else
                            e['returnValue'] = false;
                        stateNavigator.navigateLink(link, ko.unwrap(allBindings.get('historyAction')));
                    }
                }
            }
        });
        if (!lazy) {
            stateNavigator.onNavigate(setLink);
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () { return stateNavigator.offNavigate(setLink); });
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
}());
module.exports = LinkUtility;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
(function (global){
"use strict";
var LinkUtility = _dereq_('./LinkUtility');
var ko = (typeof window !== "undefined" ? window['ko'] : typeof global !== "undefined" ? global['ko'] : null);
var NavigationBackLink = ko.bindingHandlers['navigationBackLink'] = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        LinkUtility.addListeners(element, function () { return setNavigationBackLink(element, valueAccessor, allBindings); }, allBindings, viewModel);
    },
    update: function (element, valueAccessor, allBindings) {
        setNavigationBackLink(element, valueAccessor, allBindings);
    }
};
function setNavigationBackLink(element, valueAccessor, allBindings) {
    var stateNavigator = allBindings.get('stateNavigator');
    LinkUtility.setLink(stateNavigator, element, function () { return stateNavigator.getNavigationBackLink(ko.unwrap(valueAccessor())); });
}
module.exports = NavigationBackLink;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":1}],3:[function(_dereq_,module,exports){
"use strict";
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
}());
module.exports = NavigationKnockout;
},{"./NavigationBackLink":2,"./NavigationLink":4,"./RefreshLink":5}],4:[function(_dereq_,module,exports){
(function (global){
"use strict";
var LinkUtility = _dereq_('./LinkUtility');
var ko = (typeof window !== "undefined" ? window['ko'] : typeof global !== "undefined" ? global['ko'] : null);
var NavigationLink = ko.bindingHandlers['navigationLink'] = {
    init: function (element, valueAccessor, allBindings, viewModel) {
        LinkUtility.addListeners(element, function () { return setNavigationLink(element, valueAccessor, allBindings); }, allBindings, viewModel);
    },
    update: function (element, valueAccessor, allBindings) {
        setNavigationLink(element, valueAccessor, allBindings);
    }
};
function setNavigationLink(element, valueAccessor, allBindings) {
    var stateKey = ko.unwrap(valueAccessor());
    var data = {};
    var navigationData = ko.unwrap(allBindings.get('navigationData'));
    var active = true;
    var stateNavigator = allBindings.get('stateNavigator');
    for (var key in navigationData) {
        var val = ko.unwrap(navigationData[key]);
        data[key] = val;
        active = active && LinkUtility.isActive(stateNavigator, key, val);
    }
    LinkUtility.setLink(stateNavigator, element, function () { return stateNavigator.getNavigationLink(stateKey, LinkUtility.getData(stateNavigator, data, ko.unwrap(allBindings.get('includeCurrentData')), ko.unwrap(allBindings.get('currentDataKeys')))); });
    active = active && !!element.href && stateNavigator.stateContext.state && stateNavigator.stateContext.state.key === stateKey;
    LinkUtility.setActive(element, active, ko.unwrap(allBindings.get('activeCssClass')), ko.unwrap(allBindings.get('disableActive')));
}
module.exports = NavigationLink;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":1}],5:[function(_dereq_,module,exports){
(function (global){
"use strict";
var LinkUtility = _dereq_('./LinkUtility');
var ko = (typeof window !== "undefined" ? window['ko'] : typeof global !== "undefined" ? global['ko'] : null);
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
    var navigationData = ko.unwrap(valueAccessor());
    var active = true;
    var stateNavigator = allBindings.get('stateNavigator');
    for (var key in navigationData) {
        var val = ko.unwrap(navigationData[key]);
        data[key] = val;
        active = active && LinkUtility.isActive(stateNavigator, key, val);
    }
    LinkUtility.setLink(stateNavigator, element, function () { return stateNavigator.getRefreshLink(LinkUtility.getData(stateNavigator, data, ko.unwrap(allBindings.get('includeCurrentData')), ko.unwrap(allBindings.get('currentDataKeys')))); });
    active = active && !!element.href;
    LinkUtility.setActive(element, active, ko.unwrap(allBindings.get('activeCssClass')), ko.unwrap(allBindings.get('disableActive')));
}
module.exports = RefreshLink;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":1}]},{},[3])(3)
});