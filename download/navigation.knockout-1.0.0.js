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
        if (element.getAttribute('data-state-context-url') !== Navigation.StateContext.url) {
            try {
                element.href = Navigation.historyManager.getHref(linkAccessor());
            }
            catch (e) {
                element.removeAttribute('href');
            }
            element.setAttribute('data-state-context-url', Navigation.StateContext.url);
        }
    };
    LinkUtility.getData = function (toData, includeCurrentData, currentDataKeys) {
        var data = {};
        toData = ko.unwrap(toData);
        for (var key in toData) {
            data[key] = ko.unwrap(toData[key]);
        }
        includeCurrentData = ko.unwrap(includeCurrentData);
        currentDataKeys = ko.unwrap(currentDataKeys);
        if (currentDataKeys)
            data = Navigation.StateContext.includeCurrentData(data, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            data = Navigation.StateContext.includeCurrentData(data);
        return data;
    };
    LinkUtility.addClickListener = function (element) {
        var navigate = function (e) {
            if (!e.ctrlKey && !e.shiftKey) {
                if (element.href) {
                    if (e.preventDefault)
                        e.preventDefault();
                    else
                        e['returnValue'] = false;
                    Navigation.StateController.navigateLink(Navigation.historyManager.getUrl(element));
                }
            }
        };
        if (window.addEventListener)
            element.addEventListener('click', navigate);
        else
            element.attachEvent('onclick', navigate);
    };
    LinkUtility.addNavigateHandler = function (element, handler) {
        Navigation.StateController.onNavigate(handler);
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () { return Navigation.StateController.offNavigate(handler); });
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
    init: function (element, valueAccessor) {
        LinkUtility.addClickListener(element);
        LinkUtility.addNavigateHandler(element, function () { return setNavigationBackLink(element, valueAccessor); });
    },
    update: function (element, valueAccessor) {
        element.removeAttribute('data-state-context-url');
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
    init: function (element, valueAccessor, allBindings) {
        LinkUtility.addClickListener(element);
        LinkUtility.addNavigateHandler(element, function () { return setNavigationLink(element, valueAccessor, allBindings); });
    },
    update: function (element, valueAccessor, allBindings) {
        element.removeAttribute('data-state-context-url');
        setNavigationLink(element, valueAccessor, allBindings);
    }
};
function setNavigationLink(element, valueAccessor, allBindings) {
    LinkUtility.setLink(element, function () { return Navigation.StateController.getNavigationLink(ko.unwrap(valueAccessor()), LinkUtility.getData(allBindings.get('toData'), allBindings.get('includeCurrentData'), allBindings.get('currentDataKeys'))); });
}
module.exports = NavigationLink;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":2}],5:[function(_dereq_,module,exports){
(function (global){
var LinkUtility = _dereq_('./LinkUtility');
var Navigation = (typeof window !== "undefined" ? window.Navigation : typeof global !== "undefined" ? global.Navigation : null);
var ko = (typeof window !== "undefined" ? window.ko : typeof global !== "undefined" ? global.ko : null);
var RefreshLink = ko.bindingHandlers['refreshLink'] = {
    init: function (element, valueAccessor, allBindings) {
        LinkUtility.addClickListener(element);
        LinkUtility.addNavigateHandler(element, function () { return setRefreshLink(element, valueAccessor, allBindings); });
    },
    update: function (element, valueAccessor, allBindings) {
        element.removeAttribute('data-state-context-url');
        setRefreshLink(element, valueAccessor, allBindings);
    }
};
function setRefreshLink(element, valueAccessor, allBindings) {
    LinkUtility.setLink(element, function () { return Navigation.StateController.getRefreshLink(LinkUtility.getData(valueAccessor(), allBindings.get('includeCurrentData'), allBindings.get('currentDataKeys'))); });
}
module.exports = RefreshLink;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./LinkUtility":2}]},{},[1])(1)
});