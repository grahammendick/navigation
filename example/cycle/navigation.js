/**
 * Navigation v1.3.0
 * (c) Graham Mendick - http://grahammendick.github.io/navigation/
 * License: Apache License 2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Navigation = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var NavigationData = _dereq_('./NavigationData');
var Crumb = (function () {
    function Crumb(data, state, link, last) {
        this.data = data ? data : {};
        this.state = state;
        this.last = last;
        this.title = state.title;
        this.navigationLink = link;
        NavigationData.setDefaults(this.data, this.state.defaults);
    }
    return Crumb;
})();
module.exports = Crumb;
},{"./NavigationData":5}],2:[function(_dereq_,module,exports){
var Crumb = _dereq_('./Crumb');
var NavigationData = _dereq_('./NavigationData');
var ReturnDataManager = _dereq_('./ReturnDataManager');
var CrumbTrailManager = (function () {
    function CrumbTrailManager() {
    }
    CrumbTrailManager.buildCrumbTrail = function (stateContext, settings, dialogs, uncombined) {
        var crumbs = this.getCrumbs(stateContext, settings, dialogs, false);
        if (uncombined)
            crumbs.push(new Crumb(stateContext.previousData, stateContext.previousState, this.getHref(stateContext, settings, stateContext.previousState, stateContext.previousData, null), false));
        crumbs = stateContext.state.stateHandler.truncateCrumbTrail(stateContext.state, crumbs);
        if (settings.combineCrumbTrail)
            crumbs.push(new Crumb(stateContext.data, stateContext.state, this.getHref(stateContext, settings, stateContext.state, stateContext.data, null), false));
        crumbs.reverse();
        var trailString = '';
        for (var i = 0; i < crumbs.length; i++) {
            trailString += this.CRUMB_1_SEP + crumbs[i].state.id + this.CRUMB_2_SEP;
            trailString += ReturnDataManager.formatReturnData(settings, crumbs[i].state, crumbs[i].data);
        }
        stateContext.crumbTrail = trailString ? trailString : null;
        stateContext.crumbTrailKey = settings.crumbTrailPersister.save(stateContext.crumbTrail, stateContext);
    };
    CrumbTrailManager.getCrumbs = function (stateContext, settings, dialogs, setLast, skipLatest) {
        var crumbTrailArray = [];
        var arrayCount = 0;
        var trail = stateContext.crumbTrail;
        var crumbTrailSize = !trail ? 0 : trail.split(this.CRUMB_1_SEP).length - 1;
        var last = true;
        while (arrayCount < crumbTrailSize) {
            var stateKey = trail.substring(this.CRUMB_1_SEP.length).split(this.CRUMB_2_SEP)[0];
            var state = this.getState(stateKey, dialogs);
            var navigationData = {};
            var data = trail.substring((trail.indexOf(this.CRUMB_2_SEP) + this.CRUMB_2_SEP.length)).split(this.CRUMB_1_SEP)[0];
            if (data)
                navigationData = ReturnDataManager.parseReturnData(settings, data, state);
            var nextTrailStart = trail.indexOf(this.CRUMB_1_SEP, 1);
            trail = nextTrailStart != -1 ? trail.substring(nextTrailStart) : '';
            if (!skipLatest) {
                crumbTrailArray.push(new Crumb(navigationData, state, this.getHref(stateContext, settings, state, navigationData, null), setLast && last));
                last = false;
            }
            skipLatest = false;
            arrayCount++;
        }
        crumbTrailArray.reverse();
        return crumbTrailArray;
    };
    CrumbTrailManager.getState = function (id, dialogs) {
        if (!id)
            return null;
        var ids = id.split('-');
        return dialogs[+ids[0]]._states[+ids[1]];
    };
    CrumbTrailManager.getHref = function (stateContext, settings, state, navigationData, returnData) {
        var data = {};
        data[settings.stateIdKey] = state.id;
        if (!settings.combineCrumbTrail && state.trackCrumbTrail && stateContext.state)
            data[settings.previousStateIdKey] = stateContext.state.id;
        if (!settings.router.supportsDefaults) {
            navigationData = NavigationData.clone(navigationData);
            NavigationData.setDefaults(navigationData, state.defaults);
        }
        var arrayData = {};
        for (var key in navigationData) {
            var val = navigationData[key];
            if (val != null && val.toString()) {
                var formattedData = ReturnDataManager.formatURLObject(settings, key, val, state);
                val = formattedData.val;
                if (!settings.router.supportsDefaults || val !== state.formattedDefaults[key]) {
                    data[key] = val;
                    arrayData[key] = formattedData.arrayVal;
                }
            }
        }
        if (!settings.combineCrumbTrail && state.trackCrumbTrail && stateContext.state) {
            if (settings.trackAllPreviousData)
                returnData = stateContext.data;
            var returnDataString = ReturnDataManager.formatReturnData(settings, stateContext.state, returnData);
            if (returnDataString)
                data[settings.returnDataKey] = returnDataString;
        }
        if (stateContext.crumbTrailKey && state.trackCrumbTrail)
            data[settings.crumbTrailKey] = stateContext.crumbTrailKey;
        return state.stateHandler.getNavigationLink(settings, state, data, arrayData);
    };
    CrumbTrailManager.getRefreshHref = function (stateContext, settings, refreshData) {
        return this.getHref(stateContext, settings, stateContext.state, refreshData, null);
    };
    CrumbTrailManager.CRUMB_1_SEP = '4_';
    CrumbTrailManager.CRUMB_2_SEP = '5_';
    return CrumbTrailManager;
})();
module.exports = CrumbTrailManager;
},{"./Crumb":1,"./NavigationData":5,"./ReturnDataManager":7}],3:[function(_dereq_,module,exports){
var CrumbTrailPersister = (function () {
    function CrumbTrailPersister() {
    }
    CrumbTrailPersister.prototype.load = function (crumbTrail) {
        return crumbTrail;
    };
    CrumbTrailPersister.prototype.save = function (crumbTrail, stateContext) {
        return crumbTrail;
    };
    return CrumbTrailPersister;
})();
module.exports = CrumbTrailPersister;
},{}],4:[function(_dereq_,module,exports){
var StateContext = _dereq_('./StateContext');
var StateController = _dereq_('./StateController');
var Dialog = _dereq_('./config/Dialog');
var State = _dereq_('./config/State');
var Transition = _dereq_('./config/Transition');
var StateInfoConfig = _dereq_('./config/StateInfoConfig');
var HistoryAction = _dereq_('./history/HistoryAction');
var HashHistoryManager = _dereq_('./history/HashHistoryManager');
var HTML5HistoryManager = _dereq_('./history/HTML5HistoryManager');
var CrumbTrailPersister = _dereq_('./CrumbTrailPersister');
var StorageCrumbTrailPersister = _dereq_('./StorageCrumbTrailPersister');
var Crumb = _dereq_('./Crumb');
var StateHandler = _dereq_('./StateHandler');
var StateRouter = _dereq_('./StateRouter');
var NavigationSettings = _dereq_('./NavigationSettings');
var Route = _dereq_('./routing/Route');
var Router = _dereq_('./routing/Router');
var Navigation = (function () {
    function Navigation() {
    }
    Navigation.Dialog = Dialog;
    Navigation.State = State;
    Navigation.Transition = Transition;
    Navigation.StateInfoConfig = StateInfoConfig;
    Navigation.HistoryAction = HistoryAction;
    Navigation.HashHistoryManager = HashHistoryManager;
    Navigation.HTML5HistoryManager = HTML5HistoryManager;
    Navigation.CrumbTrailPersister = CrumbTrailPersister;
    Navigation.StorageCrumbTrailPersister = StorageCrumbTrailPersister;
    Navigation.Crumb = Crumb;
    Navigation.NavigationSettings = NavigationSettings;
    Navigation.StateContext = StateContext;
    Navigation.StateController = StateController;
    Navigation.StateHandler = StateHandler;
    Navigation.StateRouter = StateRouter;
    Navigation.Route = Route;
    Navigation.Router = Router;
    return Navigation;
})();
module.exports = Navigation;
},{"./Crumb":1,"./CrumbTrailPersister":3,"./NavigationSettings":6,"./StateContext":8,"./StateController":9,"./StateHandler":10,"./StateRouter":11,"./StorageCrumbTrailPersister":12,"./config/Dialog":13,"./config/State":14,"./config/StateInfoConfig":15,"./config/Transition":16,"./history/HTML5HistoryManager":24,"./history/HashHistoryManager":25,"./history/HistoryAction":26,"./routing/Route":27,"./routing/Router":28}],5:[function(_dereq_,module,exports){
var NavigationData = (function () {
    function NavigationData() {
    }
    NavigationData.setDefaults = function (data, defaults) {
        for (var key in defaults) {
            if (data[key] == null || !data[key].toString())
                data[key] = defaults[key];
        }
    };
    NavigationData.clone = function (data) {
        var clone = {};
        for (var key in data)
            clone[key] = data[key];
        return clone;
    };
    return NavigationData;
})();
module.exports = NavigationData;
},{}],6:[function(_dereq_,module,exports){
var StateRouter = _dereq_('./StateRouter');
var HashHistoryManager = _dereq_('./history/HashHistoryManager');
var CrumbTrailPersister = _dereq_('./CrumbTrailPersister');
var NavigationSettings = (function () {
    function NavigationSettings() {
        this.router = new StateRouter();
        this.historyManager = new HashHistoryManager();
        this.crumbTrailPersister = new CrumbTrailPersister();
        this.stateIdKey = 'c0';
        this.previousStateIdKey = 'c1';
        this.returnDataKey = 'c2';
        this.crumbTrailKey = 'c3';
        this.applicationPath = '';
        this.combineCrumbTrail = true;
        this.trackAllPreviousData = true;
        this.combineArray = false;
    }
    return NavigationSettings;
})();
module.exports = NavigationSettings;
},{"./CrumbTrailPersister":3,"./StateRouter":11,"./history/HashHistoryManager":25}],7:[function(_dereq_,module,exports){
var ConverterFactory = _dereq_('./converter/ConverterFactory');
var ReturnDataManager = (function () {
    function ReturnDataManager() {
    }
    ReturnDataManager.formatReturnData = function (settings, state, returnData) {
        var returnDataArray = [];
        for (var key in returnData) {
            if (returnData[key] != null && returnData[key].toString()) {
                var val = this.formatURLObject(settings, key, returnData[key], state, true).val;
                if (!settings.router.supportsDefaults || val !== state.formattedDefaults[key])
                    returnDataArray.push(this.encodeUrlValue(key) + this.RET_1_SEP + val);
            }
        }
        return returnDataArray.join(this.RET_3_SEP);
    };
    ReturnDataManager.decodeUrlValue = function (urlValue) {
        return urlValue.replace(new RegExp('0' + this.SEPARATOR, 'g'), this.SEPARATOR);
    };
    ReturnDataManager.encodeUrlValue = function (urlValue) {
        return urlValue.replace(new RegExp(this.SEPARATOR, 'g'), '0' + this.SEPARATOR);
    };
    ReturnDataManager.formatURLObject = function (settings, key, urlObject, state, encode) {
        if (encode === void 0) { encode = false; }
        encode = encode || state.trackTypes;
        var defaultType = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
        var converter = ConverterFactory.getConverter(urlObject);
        var convertedValue = converter.convertTo(urlObject, settings.combineArray);
        var formattedValue = convertedValue.val;
        var formattedArray = convertedValue.arrayVal;
        if (encode) {
            formattedValue = this.encodeUrlValue(formattedValue);
            if (formattedArray)
                formattedArray[0] = this.encodeUrlValue(formattedArray[0]);
        }
        if (state.trackTypes && converter.name !== defaultType) {
            formattedValue += this.RET_2_SEP + converter.key;
            if (formattedArray)
                formattedArray[0] = formattedArray[0] + this.RET_2_SEP + converter.key;
        }
        return { val: formattedValue, arrayVal: formattedArray };
    };
    ReturnDataManager.parseURLString = function (settings, key, val, state, decode, separable) {
        if (decode === void 0) { decode = false; }
        if (separable === void 0) { separable = false; }
        decode = decode || state.trackTypes;
        var defaultType = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
        var urlValue = typeof val === 'string' ? val : val[0];
        var converterKey = ConverterFactory.getConverterFromName(defaultType).key;
        if (state.trackTypes && urlValue.indexOf(this.RET_2_SEP) > -1) {
            var arr = urlValue.split(this.RET_2_SEP);
            urlValue = arr[0];
            converterKey = arr[1];
        }
        if (decode)
            urlValue = this.decodeUrlValue(urlValue);
        if (typeof val === 'string')
            val = urlValue;
        else
            val[0] = urlValue;
        return ConverterFactory.getConverterFromKey(converterKey).convertFrom(val, settings.combineArray, separable);
    };
    ReturnDataManager.parseReturnData = function (settings, returnData, state) {
        var navigationData = {};
        var returnDataArray = returnData.split(this.RET_3_SEP);
        for (var i = 0; i < returnDataArray.length; i++) {
            var nameValuePair = returnDataArray[i].split(this.RET_1_SEP);
            navigationData[this.decodeUrlValue(nameValuePair[0])] = this.parseURLString(settings, this.decodeUrlValue(nameValuePair[0]), nameValuePair[1], state, true);
        }
        return navigationData;
    };
    ReturnDataManager.SEPARATOR = '_';
    ReturnDataManager.RET_1_SEP = '1_';
    ReturnDataManager.RET_2_SEP = '2_';
    ReturnDataManager.RET_3_SEP = '3_';
    return ReturnDataManager;
})();
module.exports = ReturnDataManager;
},{"./converter/ConverterFactory":19}],8:[function(_dereq_,module,exports){
var StateContext = (function () {
    function StateContext() {
        this.oldState = null;
        this.oldDialog = null;
        this.oldData = {};
        this.previousState = null;
        this.previousDialog = null;
        this.previousData = {};
        this.state = null;
        this.dialog = null;
        this.data = {};
        this.url = null;
        this.title = null;
        this.crumbTrail = null;
        this.crumbTrailKey = null;
    }
    StateContext.prototype.includeCurrentData = function (data, keys) {
        if (!keys) {
            keys = [];
            for (var key in this.data)
                keys.push(key);
        }
        var newData = {};
        for (var i = 0; i < keys.length; i++)
            newData[keys[i]] = this.data[keys[i]];
        for (var key in data)
            newData[key] = data[key];
        return newData;
    };
    StateContext.prototype.clear = function (key) {
        if (key)
            this.data[key] = this.state.defaults[key];
        else {
            for (var dataKey in this.data) {
                this.data[dataKey] = this.state.defaults[dataKey];
            }
        }
    };
    return StateContext;
})();
module.exports = StateContext;
},{}],9:[function(_dereq_,module,exports){
var CrumbTrailManager = _dereq_('./CrumbTrailManager');
var HistoryAction = _dereq_('./history/HistoryAction');
var NavigationData = _dereq_('./NavigationData');
var NavigationSettings = _dereq_('./NavigationSettings');
var ReturnDataManager = _dereq_('./ReturnDataManager');
var StateContext = _dereq_('./StateContext');
var StateInfoConfig = _dereq_('./config/StateInfoConfig');
var StateController = (function () {
    function StateController(dialogs, settings) {
        this.NAVIGATE_HANDLER_ID = 'navigateHandlerId';
        this.navigateHandlerId = 1;
        this.navigateHandlers = {};
        this.stateContext = new StateContext();
        this.settings = new NavigationSettings();
        this._dialogs = [];
        this.dialogs = {};
        for (var setting in settings)
            this.settings[setting] = settings[setting];
        this.buildDialogs(dialogs);
    }
    StateController.prototype.buildDialogs = function (dialogs) {
        var config = StateInfoConfig.build(dialogs, this.settings);
        this._dialogs = config._dialogs;
        this.dialogs = config.dialogs;
        this.settings.router.addRoutes(this._dialogs);
    };
    StateController.prototype.setStateContext = function (state, url) {
        try {
            this.setOldStateContext();
            this.stateContext.state = state;
            this.stateContext.url = url;
            this.stateContext.dialog = state.parent;
            this.stateContext.title = state.title;
            var separableData = {};
            var data = state.stateHandler.getNavigationData(this.settings, state, url, separableData);
            this.stateContext.data = this.parseData(data, state, separableData);
            this.stateContext.previousState = null;
            this.stateContext.previousDialog = null;
            this.stateContext.previousData = {};
            this.stateContext.crumbTrail = this.settings.crumbTrailPersister.load(data[this.settings.crumbTrailKey]);
            var uncombined = !!data[this.settings.previousStateIdKey];
            this.setPreviousStateContext(uncombined, data);
            CrumbTrailManager.buildCrumbTrail(this.stateContext, this.settings, this._dialogs, uncombined);
            this.crumbs = CrumbTrailManager.getCrumbs(this.stateContext, this.settings, this._dialogs, true, this.settings.combineCrumbTrail);
        }
        catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
    };
    StateController.prototype.clearStateContext = function () {
        this.stateContext.oldState = null;
        this.stateContext.oldDialog = null;
        this.stateContext.oldData = {};
        this.stateContext.previousState = null;
        this.stateContext.previousDialog = null;
        this.stateContext.previousData = {};
        this.stateContext.state = null;
        this.stateContext.dialog = null;
        this.stateContext.data = {};
        this.stateContext.url = null;
        this.stateContext.title = null;
        this.stateContext.crumbTrail = null;
        this.stateContext.crumbTrailKey = null;
    };
    StateController.prototype.setOldStateContext = function () {
        if (this.stateContext.state) {
            this.stateContext.oldState = this.stateContext.state;
            this.stateContext.oldDialog = this.stateContext.dialog;
            this.stateContext.oldData = NavigationData.clone(this.stateContext.data);
            NavigationData.setDefaults(this.stateContext.oldData, this.stateContext.oldState.defaults);
        }
    };
    StateController.prototype.setPreviousStateContext = function (uncombined, data) {
        if (uncombined) {
            this.stateContext.previousState = CrumbTrailManager.getState(data[this.settings.previousStateIdKey], this._dialogs);
            if (this.stateContext.previousState)
                this.stateContext.previousDialog = this.stateContext.previousState.parent;
            if (data[this.settings.returnDataKey])
                this.stateContext.previousData = ReturnDataManager.parseReturnData(this.settings, data[this.settings.returnDataKey], this.stateContext.previousState);
        }
        else {
            var previousStateCrumb = CrumbTrailManager.getCrumbs(this.stateContext, this.settings, this._dialogs, false).pop();
            if (previousStateCrumb) {
                this.stateContext.previousState = previousStateCrumb.state;
                this.stateContext.previousDialog = this.stateContext.previousState.parent;
                this.stateContext.previousData = previousStateCrumb.data;
            }
        }
    };
    StateController.prototype.onNavigate = function (handler) {
        if (!handler[this.NAVIGATE_HANDLER_ID]) {
            var id = this.NAVIGATE_HANDLER_ID + this.navigateHandlerId++;
            handler[this.NAVIGATE_HANDLER_ID] = id;
            this.navigateHandlers[id] = handler;
        }
    };
    StateController.prototype.offNavigate = function (handler) {
        delete this.navigateHandlers[handler[this.NAVIGATE_HANDLER_ID]];
        delete handler[this.NAVIGATE_HANDLER_ID];
    };
    StateController.prototype.navigate = function (action, toData, historyAction) {
        var url = this.getNavigationLink(action, toData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, this.getNextState(action), false, historyAction);
    };
    StateController.prototype.getNavigationLink = function (action, toData) {
        return CrumbTrailManager.getHref(this.stateContext, this.settings, this.getNextState(action), toData, this.stateContext.data);
    };
    StateController.prototype.canNavigateBack = function (distance) {
        var canNavigate = false;
        if (distance <= this.crumbs.length && distance > 0)
            canNavigate = true;
        return canNavigate;
    };
    StateController.prototype.navigateBack = function (distance, historyAction) {
        var url = this.getNavigationBackLink(distance);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, this.getCrumb(distance).state, false, historyAction);
    };
    StateController.prototype.getNavigationBackLink = function (distance) {
        return this.getCrumb(distance).navigationLink;
    };
    StateController.prototype.refresh = function (toData, historyAction) {
        var url = this.getRefreshLink(toData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, this.stateContext.state, false, historyAction);
    };
    StateController.prototype.getRefreshLink = function (toData) {
        return CrumbTrailManager.getRefreshHref(this.stateContext, this.settings, toData);
    };
    StateController.prototype.navigateLink = function (url, history, historyAction) {
        try {
            var state = this.settings.router.getData(url.split('?')[0]).state;
        }
        catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
        this._navigateLink(url, state, history, historyAction);
    };
    StateController.prototype._navigateLink = function (url, state, history, historyAction) {
        var _this = this;
        if (history === void 0) { history = false; }
        if (historyAction === void 0) { historyAction = HistoryAction.Add; }
        try {
            var oldUrl = this.stateContext.url;
            var separableData = {};
            var data = state.stateHandler.getNavigationData(this.settings, state, url, separableData);
            data = this.parseData(data, state, separableData);
        }
        catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
        var navigateContinuation = this.getNavigateContinuation(oldUrl, state, url, historyAction);
        var unloadContinuation = function () {
            if (oldUrl === _this.stateContext.url)
                state.navigating(data, url, navigateContinuation, history);
        };
        if (this.stateContext.state)
            this.stateContext.state.unloading(state, data, url, unloadContinuation, history);
        else
            state.navigating(data, url, navigateContinuation, history);
    };
    StateController.prototype.getNavigateContinuation = function (oldUrl, state, url, historyAction) {
        var _this = this;
        return function (asyncData) {
            if (oldUrl === _this.stateContext.url) {
                state.stateHandler.navigateLink(_this.stateContext.state, state, url);
                _this.setStateContext(state, url);
                if (_this.stateContext.oldState && _this.stateContext.oldState !== state)
                    _this.stateContext.oldState.dispose();
                state.navigated(_this.stateContext.data, asyncData);
                for (var id in _this.navigateHandlers) {
                    if (url === _this.stateContext.url)
                        _this.navigateHandlers[id](_this.stateContext.oldState, state, _this.stateContext.data);
                }
                if (url === _this.stateContext.url) {
                    if (historyAction !== HistoryAction.None)
                        _this.settings.historyManager.addHistory(_this.stateContext, url, historyAction === HistoryAction.Replace, _this.settings.applicationPath);
                    if (_this.stateContext.title && (typeof document !== 'undefined'))
                        document.title = _this.stateContext.title;
                }
            }
        };
    };
    StateController.prototype.parseData = function (data, state, separableData) {
        var newData = {};
        for (var key in data) {
            if (key !== this.settings.previousStateIdKey && key !== this.settings.returnDataKey
                && key !== this.settings.crumbTrailKey && !this.isDefault(key, data, state, !!separableData[key]))
                newData[key] = ReturnDataManager.parseURLString(this.settings, key, data[key], state, false, !!separableData[key]);
        }
        NavigationData.setDefaults(newData, state.defaults);
        return newData;
    };
    StateController.prototype.isDefault = function (key, data, state, separable) {
        var val = data[key];
        var arrayDefaultVal = state.formattedArrayDefaults[key];
        if (!separable || !arrayDefaultVal) {
            return val === state.formattedDefaults[key];
        }
        else {
            if (typeof val === 'string')
                val = [val];
            if (val.length !== arrayDefaultVal.length)
                return false;
            for (var i = 0; i < val.length; i++) {
                if (val[i] !== arrayDefaultVal[i])
                    return false;
            }
            return true;
        }
    };
    StateController.prototype.getNextState = function (action) {
        var nextState = null;
        if (this.stateContext.state && this.stateContext.state.transitions[action])
            nextState = this.stateContext.state.transitions[action].to;
        if (!nextState && this.dialogs[action])
            nextState = this.dialogs[action].initial;
        if (!nextState)
            throw new Error('The action parameter must be a Dialog key or a Transition key that is a child of the current State');
        return nextState;
    };
    StateController.prototype.getCrumb = function (distance) {
        if (distance > this.crumbs.length || distance <= 0)
            throw new Error('The distance parameter must be greater than zero and less than or equal to the number of Crumbs (' + this.crumbs.length + ')');
        return this.crumbs[this.crumbs.length - distance];
    };
    StateController.prototype.start = function (url) {
        var _this = this;
        this.settings.historyManager.init(function () {
            if (_this.stateContext.url === _this.settings.historyManager.getCurrentUrl(_this.settings.applicationPath))
                return;
            _this.navigateLink(_this.settings.historyManager.getCurrentUrl(_this.settings.applicationPath), true);
        });
        this.navigateLink(url ? url : this.settings.historyManager.getCurrentUrl(this.settings.applicationPath));
    };
    ;
    return StateController;
})();
module.exports = StateController;
},{"./CrumbTrailManager":2,"./NavigationData":5,"./NavigationSettings":6,"./ReturnDataManager":7,"./StateContext":8,"./config/StateInfoConfig":15,"./history/HistoryAction":26}],10:[function(_dereq_,module,exports){
var StateHandler = (function () {
    function StateHandler() {
    }
    StateHandler.prototype.getNavigationLink = function (settings, state, data, arrayData) {
        if (arrayData === void 0) { arrayData = {}; }
        var routeInfo = settings.router.getRoute(state, data, arrayData);
        if (routeInfo.route == null)
            return null;
        var query = [];
        for (var key in data) {
            if (key !== settings.stateIdKey && !routeInfo.data[key]) {
                var arr = arrayData[key];
                var encodedKey = this.urlEncode(state, null, key, true);
                if (!arr) {
                    query.push(encodedKey + '=' + this.urlEncode(state, key, data[key], true));
                }
                else {
                    for (var i = 0; i < arr.length; i++)
                        query.push(encodedKey + '=' + this.urlEncode(state, key, arr[i], true));
                }
            }
        }
        if (query.length > 0)
            routeInfo.route += '?' + query.join('&');
        return routeInfo.route;
    };
    StateHandler.prototype.navigateLink = function (oldState, state, url) {
    };
    StateHandler.prototype.getNavigationData = function (settings, state, url, separableData) {
        if (separableData === void 0) { separableData = {}; }
        var queryIndex = url.indexOf('?');
        var route = queryIndex < 0 ? url : url.substring(0, queryIndex);
        var data = settings.router.getData(route, separableData).data;
        data = data ? data : {};
        if (queryIndex >= 0) {
            var query = url.substring(queryIndex + 1);
            var params = query.split('&');
            for (var i = 0; i < params.length; i++) {
                var param = params[i].split('=');
                var key = this.urlDecode(state, null, param[0], true);
                var val = this.urlDecode(state, key, param[1], true);
                separableData[key] = true;
                var arr = data[key];
                if (!arr) {
                    data[key] = val;
                }
                else {
                    if (typeof arr === 'string')
                        data[key] = arr = [arr];
                    arr.push(val);
                }
            }
        }
        return data;
    };
    StateHandler.prototype.urlEncode = function (state, key, val, queryString) {
        return encodeURIComponent(val);
    };
    StateHandler.prototype.urlDecode = function (state, key, val, queryString) {
        return decodeURIComponent(val);
    };
    StateHandler.prototype.truncateCrumbTrail = function (state, crumbs) {
        var newCrumbs = [];
        if (state.parent.initial === state)
            return newCrumbs;
        for (var i = 0; i < crumbs.length; i++) {
            if (crumbs[i].state === state)
                break;
            newCrumbs.push(crumbs[i]);
        }
        return newCrumbs;
    };
    return StateHandler;
})();
module.exports = StateHandler;
},{}],11:[function(_dereq_,module,exports){
var Router = _dereq_('./routing/Router');
var StateRouter = (function () {
    function StateRouter() {
        this.supportsDefaults = true;
    }
    StateRouter.prototype.getData = function (route, separableData) {
        if (separableData === void 0) { separableData = {}; }
        var match = this.router.match(route, StateRouter.urlDecode);
        if (match.route['_splat']) {
            for (var i = 0; i < match.route.params.length; i++) {
                var param = match.route.params[i];
                if (param.splat)
                    separableData[param.name] = true;
            }
        }
        return { state: match.route['_state'], data: match.data };
    };
    StateRouter.prototype.getRoute = function (state, data, arrayData) {
        if (arrayData === void 0) { arrayData = {}; }
        var routeInfo = state['_routeInfo'];
        var paramsKey = '';
        for (var key in routeInfo.params) {
            if (data[key])
                paramsKey += routeInfo.params[key] + ',';
        }
        paramsKey = paramsKey.slice(0, -1);
        var routeMatch = routeInfo.matches[paramsKey];
        var routePath = null;
        if (routeMatch) {
            var combinedData = StateRouter.getCombinedData(routeMatch.route, data, arrayData);
            routePath = routeMatch.route.build(combinedData, StateRouter.urlEncode);
        }
        else {
            var bestMatch = StateRouter.findBestMatch(routeInfo.routes, data, arrayData);
            if (bestMatch) {
                routePath = bestMatch.routePath;
                routeMatch = { route: bestMatch.route, data: bestMatch.data };
                routeInfo.matches[paramsKey] = routeMatch;
            }
        }
        return { route: routePath, data: routeMatch ? routeMatch.data : {} };
    };
    StateRouter.findBestMatch = function (routes, data, arrayData) {
        var bestMatch;
        var bestMatchCount = -1;
        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            var combinedData = StateRouter.getCombinedData(route, data, arrayData);
            var routePath = route.build(combinedData, StateRouter.urlEncode);
            if (routePath) {
                var count = 0;
                var routeData = {};
                for (var j = 0; j < route.params.length; j++) {
                    if (combinedData[route.params[j].name]) {
                        routeData[route.params[j].name] = {};
                        count++;
                    }
                }
                if (count > bestMatchCount) {
                    bestMatch = { route: route, data: routeData, routePath: routePath };
                    bestMatchCount = count;
                }
            }
        }
        return bestMatch;
    };
    StateRouter.getCombinedData = function (route, data, arrayData) {
        if (!route['_splat'])
            return data;
        var combinedData = {};
        for (var key in data)
            combinedData[key] = data[key];
        for (var i = 0; i < route.params.length; i++) {
            var param = route.params[i];
            var arr = arrayData[param.name];
            if (param.splat && arr)
                combinedData[param.name] = arr;
        }
        return combinedData;
    };
    StateRouter.urlEncode = function (route, name, val) {
        var state = route['_state'];
        if (state.stateHandler.urlEncode)
            return state.stateHandler.urlEncode(state, name, val, false);
        else
            return encodeURIComponent(val);
    };
    StateRouter.urlDecode = function (route, name, val) {
        var state = route['_state'];
        if (state.stateHandler.urlDecode)
            return state.stateHandler.urlDecode(state, name, val, false);
        else
            return decodeURIComponent(val);
    };
    StateRouter.prototype.addRoutes = function (dialogs) {
        this.router = new Router();
        for (var i = 0; i < dialogs.length; i++) {
            for (var j = 0; j < dialogs[i]._states.length; j++) {
                this.addStateRoutes(dialogs[i]._states[j]);
            }
        }
        this.router.sort(function (routeA, routeB) {
            var routeANumber = routeA.path.charAt(0) === '{' ? -1 : 0;
            var routeBNumber = routeB.path.charAt(0) === '{' ? -1 : 0;
            return routeBNumber - routeANumber;
        });
    };
    StateRouter.prototype.addStateRoutes = function (state) {
        var routeInfo = { routes: [], params: {}, matches: {} };
        var count = 0;
        var routes = StateRouter.getRoutes(state);
        for (var i = 0; i < routes.length; i++) {
            var route = this.router.addRoute(routes[i], state.formattedDefaults);
            var splat = false;
            for (var j = 0; j < route.params.length; j++) {
                var param = route.params[j];
                if (!routeInfo.params[param.name]) {
                    routeInfo.params[param.name] = count;
                    count++;
                }
                splat = splat || param.splat;
            }
            routeInfo.routes.push(route);
            route['_state'] = state;
            route['_splat'] = splat;
            route.defaults = StateRouter.getCombinedData(route, state.formattedDefaults, state.formattedArrayDefaults);
        }
        state['_routeInfo'] = routeInfo;
    };
    StateRouter.getRoutes = function (state) {
        var routes = [];
        var route = state.route;
        if (typeof route === 'string') {
            routes.push(route);
        }
        else {
            for (var i = 0; i < route.length; i++) {
                routes.push(route[i]);
            }
        }
        return routes;
    };
    return StateRouter;
})();
module.exports = StateRouter;
},{"./routing/Router":28}],12:[function(_dereq_,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CrumbTrailPersister = _dereq_('./CrumbTrailPersister');
var StorageCrumbTrailPersister = (function (_super) {
    __extends(StorageCrumbTrailPersister, _super);
    function StorageCrumbTrailPersister(maxLength, historySize, storage) {
        if (maxLength === void 0) { maxLength = 500; }
        if (historySize === void 0) { historySize = 100; }
        _super.call(this);
        this.maxLength = maxLength;
        this.historySize = historySize;
        this.storage = storage;
        if (!this.storage) {
            try {
                localStorage.setItem('CrumbTrail', 'CrumbTrail');
                localStorage.removeItem('CrumbTrail');
                this.storage = localStorage;
            }
            catch (e) {
                this.storage = new InProcStorage();
            }
        }
    }
    StorageCrumbTrailPersister.prototype.load = function (crumbTrail) {
        if (!crumbTrail)
            return crumbTrail;
        if (crumbTrail && crumbTrail.match(/^[a-z]/i)) {
            var codes = crumbTrail.match(/[a-z]\d*/ig);
            var item = this.storage.getItem('CrumbTrail' + codes[2]);
            if (!item || item.indexOf(codes[0] + codes[1] + '=') !== 0)
                return null;
            return item.substring(item.indexOf('=') + 1);
        }
        return crumbTrail;
    };
    StorageCrumbTrailPersister.prototype.save = function (crumbTrail, stateContext) {
        if (!crumbTrail)
            return crumbTrail;
        if (crumbTrail.length > this.maxLength) {
            var count = 0;
            if (this.storage.getItem('CrumbTrailCount') != null)
                count = +this.storage.getItem('CrumbTrailCount');
            var dialogCode = StorageCrumbTrailPersister.toCode(stateContext.dialog.index);
            var stateCode = StorageCrumbTrailPersister.toCode(stateContext.state.index);
            var countCode = StorageCrumbTrailPersister.toCode(count % (10 * this.historySize));
            if (count >= this.historySize) {
                var purgeCode = StorageCrumbTrailPersister.toCode((count - this.historySize) % (10 * this.historySize));
                this.storage.removeItem('CrumbTrail' + purgeCode);
            }
            this.storage.setItem('CrumbTrail' + countCode, dialogCode + stateCode + '=' + crumbTrail);
            this.storage.setItem('CrumbTrailCount', (count + 1).toString());
            return dialogCode + stateCode + countCode;
        }
        return crumbTrail;
    };
    StorageCrumbTrailPersister.toCode = function (val) {
        var rem = val % 52;
        var div = Math.floor(val / 52);
        return String.fromCharCode((rem < 26 ? 97 : 39) + rem) + (div ? div.toString() : '');
    };
    return StorageCrumbTrailPersister;
})(CrumbTrailPersister);
var InProcStorage = (function () {
    function InProcStorage() {
        this.store = {};
    }
    InProcStorage.prototype.clear = function () { throw new Error('Not implemented'); };
    InProcStorage.prototype.key = function (index) { throw new Error('Not implemented'); };
    InProcStorage.prototype.getItem = function (key) {
        return this.store[key];
    };
    InProcStorage.prototype.setItem = function (key, value) {
        this.store[key] = value;
    };
    InProcStorage.prototype.removeItem = function (key) {
        delete this.store[key];
    };
    return InProcStorage;
})();
module.exports = StorageCrumbTrailPersister;
},{"./CrumbTrailPersister":3}],13:[function(_dereq_,module,exports){
var Dialog = (function () {
    function Dialog() {
        this._states = [];
        this.states = {};
    }
    return Dialog;
})();
module.exports = Dialog;
},{}],14:[function(_dereq_,module,exports){
var StateHandler = _dereq_('../StateHandler');
var State = (function () {
    function State() {
        this._transitions = [];
        this.transitions = {};
        this.defaults = {};
        this.defaultTypes = {};
        this.formattedDefaults = {};
        this.formattedArrayDefaults = {};
        this.trackCrumbTrail = true;
        this.trackTypes = true;
        this.stateHandler = new StateHandler();
        this.unloading = function (state, data, url, unload) { unload(); };
        this.navigating = function (data, url, navigate) { navigate(); };
        this.dispose = function () { };
        this.navigated = function (data) { };
    }
    return State;
})();
module.exports = State;
},{"../StateHandler":10}],15:[function(_dereq_,module,exports){
var Dialog = _dereq_('./Dialog');
var ConverterFactory = _dereq_('../converter/ConverterFactory');
var ReturnDataManager = _dereq_('../ReturnDataManager');
var State = _dereq_('./State');
var Transition = _dereq_('./Transition');
var StateInfoConfig = (function () {
    function StateInfoConfig() {
    }
    StateInfoConfig.build = function (dialogs, settings) {
        var _builtDialogs = [];
        var builtDialogs = {};
        for (var i = 0; i < dialogs.length; i++) {
            var dialogObject = dialogs[i];
            var dialog = new Dialog();
            dialog.index = i;
            for (var key in dialogObject) {
                if (key !== 'states')
                    dialog[key] = dialogObject[key];
            }
            if (!dialog.key)
                throw new Error('key is mandatory for a Dialog');
            if (builtDialogs[dialog.key])
                throw new Error('A Dialog with key ' + dialog.key + ' already exists');
            _builtDialogs.push(dialog);
            builtDialogs[dialog.key] = dialog;
            this.processStates(dialog, dialogObject, settings);
            this.processTransitions(dialog, dialogObject);
            dialog.initial = dialog.states[dialogObject.initial];
            if (!dialogObject.initial)
                throw new Error('initial is mandatory for a Dialog');
            if (!dialog.initial)
                throw new Error(dialog.key + ' Dialog\'s initial key of ' + dialogObject.initial + ' does not match a child State key');
        }
        return {
            dialogs: builtDialogs,
            _dialogs: _builtDialogs
        };
    };
    StateInfoConfig.processStates = function (dialog, dialogObject, settings) {
        for (var i = 0; i < dialogObject.states.length; i++) {
            var stateObject = dialogObject.states[i];
            var state = new State();
            state.parent = dialog;
            state.index = i;
            state.id = dialog.index + '-' + state.index;
            for (var key in stateObject) {
                if (key !== 'transitions')
                    state[key] = stateObject[key];
            }
            for (var key in state.defaults) {
                if (!state.defaultTypes[key])
                    state.defaultTypes[key] = ConverterFactory.getConverter(state.defaults[key]).name;
                var formattedData = ReturnDataManager.formatURLObject(settings, key, state.defaults[key], state);
                state.formattedDefaults[key] = formattedData.val;
                if (formattedData.arrayVal)
                    state.formattedArrayDefaults[key] = formattedData.arrayVal;
            }
            for (var key in state.defaultTypes) {
                ConverterFactory.getConverterFromName(state.defaultTypes[key]);
            }
            if (!state.key)
                throw new Error('key is mandatory for a State');
            if (dialog.states[state.key])
                throw new Error('A State with key ' + state.key + ' already exists for Dialog ' + dialog.key);
            dialog._states.push(state);
            dialog.states[state.key] = state;
        }
    };
    StateInfoConfig.processTransitions = function (dialog, dialogObject) {
        for (var i = 0; i < dialogObject.states.length; i++) {
            if (dialogObject.states[i].transitions) {
                for (var j = 0; j < dialogObject.states[i].transitions.length; j++) {
                    var transitionObject = dialogObject.states[i].transitions[j];
                    var transition = new Transition();
                    transition.index = j;
                    transition.key = transitionObject.key;
                    if (!transition.key)
                        throw new Error('key is mandatory for a Transition');
                    transition.parent = dialog._states[i];
                    transition.to = dialog.states[transitionObject.to];
                    if (!transitionObject.to)
                        throw new Error('to is mandatory for a Transition');
                    if (!transition.to)
                        throw new Error(dialog._states[i].key + ' State\'s Transition to key of ' + transition.key + ' does not match a sibling State key');
                    if (transition.parent.transitions[transition.key])
                        throw new Error('A Transition with key ' + transition.key + ' already exists for State ' + dialog._states[i].key);
                    transition.parent._transitions.push(transition);
                    transition.parent.transitions[transition.key] = transition;
                }
            }
        }
    };
    return StateInfoConfig;
})();
module.exports = StateInfoConfig;
},{"../ReturnDataManager":7,"../converter/ConverterFactory":19,"./Dialog":13,"./State":14,"./Transition":16}],16:[function(_dereq_,module,exports){
var Transition = (function () {
    function Transition() {
    }
    return Transition;
})();
module.exports = Transition;
},{}],17:[function(_dereq_,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TypeConverter = _dereq_('./TypeConverter');
var ArrayConverter = (function (_super) {
    __extends(ArrayConverter, _super);
    function ArrayConverter(converter, key) {
        _super.call(this, key, converter.name + 'array');
        this.converter = converter;
    }
    ArrayConverter.prototype.convertFrom = function (val, combineArray, separable) {
        var arr = [];
        if (typeof val === 'string') {
            if (!separable || combineArray) {
                var vals = val.split(ArrayConverter.SEPARATOR1);
                for (var i = 0; i < vals.length; i++) {
                    if (vals[i].length !== 0)
                        arr.push(this.converter.convertFrom(vals[i].replace(new RegExp(ArrayConverter.SEPARATOR2, 'g'), ArrayConverter.SEPARATOR), combineArray));
                    else
                        arr.push(null);
                }
            }
            else {
                arr.push(this.converter.convertFrom(val, combineArray));
            }
        }
        else {
            for (var i = 0; i < val.length; i++) {
                if (val[i].length !== 0)
                    arr.push(this.converter.convertFrom(val[i], combineArray));
                else
                    arr.push(null);
            }
        }
        return arr;
    };
    ArrayConverter.prototype.convertTo = function (val, combineArray) {
        var vals = [];
        var arr = [];
        for (var i = 0; i < val.length; i++) {
            if (val[i] != null && val[i].toString()) {
                var convertedValue = this.converter.convertTo(val[i], combineArray).val;
                arr.push(convertedValue);
                vals.push(convertedValue.replace(new RegExp(ArrayConverter.SEPARATOR, 'g'), ArrayConverter.SEPARATOR2));
            }
            else {
                arr.push('');
                vals.push('');
            }
        }
        return { val: vals.join(ArrayConverter.SEPARATOR1), arrayVal: !combineArray ? arr : null };
    };
    ArrayConverter.SEPARATOR = '-';
    ArrayConverter.SEPARATOR1 = '1-';
    ArrayConverter.SEPARATOR2 = '2-';
    return ArrayConverter;
})(TypeConverter);
module.exports = ArrayConverter;
},{"./TypeConverter":23}],18:[function(_dereq_,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TypeConverter = _dereq_('./TypeConverter');
var BooleanConverter = (function (_super) {
    __extends(BooleanConverter, _super);
    function BooleanConverter(key) {
        _super.call(this, key, 'boolean');
    }
    BooleanConverter.prototype.convertFrom = function (val) {
        if (val !== 'true' && val !== 'false')
            throw Error(val + ' is not a valid boolean');
        return val === 'true';
    };
    BooleanConverter.prototype.convertTo = function (val) {
        return { val: val.toString() };
    };
    return BooleanConverter;
})(TypeConverter);
module.exports = BooleanConverter;
},{"./TypeConverter":23}],19:[function(_dereq_,module,exports){
var ArrayConverter = _dereq_('./ArrayConverter');
var BooleanConverter = _dereq_('./BooleanConverter');
var DateConverter = _dereq_('./DateConverter');
var NumberConverter = _dereq_('./NumberConverter');
var StringConverter = _dereq_('./StringConverter');
var TypeConverter = _dereq_('./TypeConverter');
var keyToConverterList = {};
var nameToKeyList = {};
var converterArray = [
    new StringConverter('0'), new BooleanConverter('1'),
    new NumberConverter('2'), new DateConverter('3')];
for (var i = 0; i < converterArray.length; i++) {
    var converter = converterArray[i];
    var arrayConverter = new ArrayConverter(converter, 'a' + converter.key);
    keyToConverterList[converter.key] = converter;
    keyToConverterList[arrayConverter.key] = arrayConverter;
    nameToKeyList[converter.name] = converter.key;
    nameToKeyList[arrayConverter.name] = arrayConverter.key;
}
var ConverterFactory = (function () {
    function ConverterFactory() {
    }
    ConverterFactory.getConverter = function (obj) {
        return this.getConverterFromName(TypeConverter.getName(obj));
    };
    ConverterFactory.getConverterFromKey = function (key) {
        return keyToConverterList[key];
    };
    ConverterFactory.getConverterFromName = function (name) {
        var key = nameToKeyList[name];
        if (!key)
            throw new Error('No TypeConverter found for ' + name);
        return this.getConverterFromKey(key);
    };
    return ConverterFactory;
})();
module.exports = ConverterFactory;
},{"./ArrayConverter":17,"./BooleanConverter":18,"./DateConverter":20,"./NumberConverter":21,"./StringConverter":22,"./TypeConverter":23}],20:[function(_dereq_,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TypeConverter = _dereq_('./TypeConverter');
var DateConverter = (function (_super) {
    __extends(DateConverter, _super);
    function DateConverter(key) {
        _super.call(this, key, 'date');
    }
    DateConverter.prototype.convertFrom = function (val) {
        var dateParts = val.split('-');
        if (dateParts.length !== 3)
            throw Error(val + ' is not a valid date');
        var date = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2]);
        if (isNaN(+date))
            throw Error(val + ' is not a valid date');
        return date;
    };
    DateConverter.prototype.convertTo = function (val) {
        var year = val.getFullYear();
        var month = ('0' + (val.getMonth() + 1)).slice(-2);
        var day = ('0' + val.getDate()).slice(-2);
        return { val: year + '-' + month + '-' + day };
    };
    return DateConverter;
})(TypeConverter);
module.exports = DateConverter;
},{"./TypeConverter":23}],21:[function(_dereq_,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TypeConverter = _dereq_('./TypeConverter');
var NumberConverter = (function (_super) {
    __extends(NumberConverter, _super);
    function NumberConverter(key) {
        _super.call(this, key, 'number');
    }
    NumberConverter.prototype.convertFrom = function (val) {
        if (isNaN(+val))
            throw Error(val + ' is not a valid number');
        return +val;
    };
    NumberConverter.prototype.convertTo = function (val) {
        return { val: val.toString() };
    };
    return NumberConverter;
})(TypeConverter);
module.exports = NumberConverter;
},{"./TypeConverter":23}],22:[function(_dereq_,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TypeConverter = _dereq_('./TypeConverter');
var StringConverter = (function (_super) {
    __extends(StringConverter, _super);
    function StringConverter(key) {
        _super.call(this, key, 'string');
    }
    StringConverter.prototype.convertFrom = function (val) {
        if (typeof val !== 'string')
            throw Error(val + ' is not a valid string');
        return val;
    };
    StringConverter.prototype.convertTo = function (val) {
        return { val: val.toString() };
    };
    return StringConverter;
})(TypeConverter);
module.exports = StringConverter;
},{"./TypeConverter":23}],23:[function(_dereq_,module,exports){
var TypeConverter = (function () {
    function TypeConverter(key, name) {
        this.key = key;
        this.name = name;
    }
    TypeConverter.prototype.convertFrom = function (val, combineArray, separable) {
        if (separable === void 0) { separable = false; }
        return null;
    };
    TypeConverter.prototype.convertTo = function (val, combineArray) {
        return null;
    };
    TypeConverter.getTypeName = function (obj) {
        var typeName = Object.prototype.toString.call(obj);
        return typeName.substring(8, typeName.length - 1).toLowerCase();
    };
    TypeConverter.getName = function (obj) {
        var fullName = this.getTypeName(obj);
        if (fullName === 'array') {
            var arr = obj;
            var subName = 'string';
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != null && arr[i].toString()) {
                    subName = this.getTypeName(arr[i]);
                    break;
                }
            }
            fullName = subName + fullName;
        }
        return fullName;
    };
    return TypeConverter;
})();
module.exports = TypeConverter;
},{}],24:[function(_dereq_,module,exports){
var HTML5HistoryManager = (function () {
    function HTML5HistoryManager() {
        this.disabled = (typeof window === 'undefined') || !(window.history && window.history.pushState);
    }
    HTML5HistoryManager.prototype.init = function (navigateHistory) {
        if (!this.disabled)
            window.addEventListener('popstate', navigateHistory);
    };
    HTML5HistoryManager.prototype.addHistory = function (stateContext, url, replace, applicationPath) {
        url = url != null ? url : stateContext.url;
        url = applicationPath + url;
        if (!this.disabled && location.pathname + location.search !== url) {
            if (!replace)
                window.history.pushState(null, null, url);
            else
                window.history.replaceState(null, null, url);
        }
    };
    HTML5HistoryManager.prototype.getCurrentUrl = function (applicationPath) {
        return location.pathname.substring(applicationPath.length) + location.search;
    };
    HTML5HistoryManager.prototype.getHref = function (url, applicationPath) {
        if (!url)
            throw new Error('The Url is invalid');
        return applicationPath + url;
    };
    HTML5HistoryManager.prototype.getUrl = function (anchor, applicationPath) {
        return anchor.pathname.substring(applicationPath.length) + anchor.search;
    };
    return HTML5HistoryManager;
})();
module.exports = HTML5HistoryManager;
},{}],25:[function(_dereq_,module,exports){
var HashHistoryManager = (function () {
    function HashHistoryManager() {
        this.disabled = (typeof window === 'undefined') || !('onhashchange' in window);
        this.replaceQueryIdentifier = false;
    }
    HashHistoryManager.prototype.init = function (navigateHistory) {
        if (!this.disabled) {
            if (window.addEventListener)
                window.addEventListener('hashchange', navigateHistory);
            else
                window['attachEvent']('onhashchange', navigateHistory);
        }
    };
    HashHistoryManager.prototype.addHistory = function (stateContext, url, replace) {
        url = url != null ? url : stateContext.url;
        url = '#' + this.encode(url);
        if (!this.disabled && location.hash !== url) {
            if (!replace)
                location.hash = url;
            else
                location.replace(url);
        }
    };
    HashHistoryManager.prototype.getCurrentUrl = function () {
        return this.decode(location.hash.substring(1));
    };
    HashHistoryManager.prototype.getHref = function (url) {
        if (!url)
            throw new Error('The Url is invalid');
        return '#' + this.encode(url);
    };
    HashHistoryManager.prototype.getUrl = function (anchor) {
        return this.decode(anchor.hash.substring(1));
    };
    HashHistoryManager.prototype.encode = function (url) {
        if (!this.replaceQueryIdentifier)
            return url;
        return url.replace('?', '#');
    };
    HashHistoryManager.prototype.decode = function (hash) {
        if (!this.replaceQueryIdentifier)
            return hash;
        return hash.replace('#', '?');
    };
    return HashHistoryManager;
})();
module.exports = HashHistoryManager;
},{}],26:[function(_dereq_,module,exports){
var HistoryAction;
(function (HistoryAction) {
    HistoryAction[HistoryAction["Add"] = 0] = "Add";
    HistoryAction[HistoryAction["Replace"] = 1] = "Replace";
    HistoryAction[HistoryAction["None"] = 2] = "None";
})(HistoryAction || (HistoryAction = {}));
module.exports = HistoryAction;
},{}],27:[function(_dereq_,module,exports){
var Segment = _dereq_('./Segment');
var Route = (function () {
    function Route(path, defaults) {
        this.segments = [];
        this.params = [];
        this.path = path;
        this.defaults = defaults ? defaults : {};
        this.parse();
    }
    Route.prototype.parse = function () {
        var subPaths = this.path.split('/').reverse();
        var segment;
        var pattern = '';
        for (var i = 0; i < subPaths.length; i++) {
            segment = new Segment(subPaths[i], segment ? segment.optional : true, this.defaults);
            this.segments.unshift(segment);
            pattern = segment.pattern + pattern;
            var params = [];
            for (var j = 0; j < segment.params.length; j++) {
                var param = segment.params[j];
                params.push({ name: param.name, optional: segment.optional, splat: param.splat });
            }
            this.params = params.concat(this.params);
        }
        this.pattern = new RegExp('^' + pattern + '$', 'i');
    };
    Route.prototype.match = function (path, urlDecode) {
        if (!urlDecode)
            urlDecode = function (route, name, val) { return decodeURIComponent(val); };
        var matches = this.pattern.exec(path);
        if (!matches)
            return null;
        var data = {};
        for (var i = 1; i < matches.length; i++) {
            var param = this.params[i - 1];
            if (matches[i]) {
                var val = !param.optional ? matches[i] : matches[i].substring(1);
                if (val.indexOf('/') === -1) {
                    data[param.name] = urlDecode(this, param.name, val);
                }
                else {
                    var vals = val.split('/');
                    var decodedVals = [];
                    for (var j = 0; j < vals.length; j++)
                        decodedVals[j] = urlDecode(this, param.name, vals[j]);
                    data[param.name] = decodedVals;
                }
            }
        }
        return data;
    };
    Route.prototype.build = function (data, urlEncode) {
        var _this = this;
        if (!urlEncode)
            urlEncode = function (route, name, val) { return encodeURIComponent(val); };
        data = data != null ? data : {};
        var route = '';
        var optional = true;
        for (var i = this.segments.length - 1; i >= 0; i--) {
            var segment = this.segments[i];
            var pathInfo = segment.build(data, this.defaults, function (name, val) { return urlEncode(_this, name, val); });
            optional = optional && pathInfo.optional;
            if (!optional) {
                if (pathInfo.path == null)
                    return null;
                route = '/' + pathInfo.path + route;
            }
        }
        return route.length !== 0 ? route : '/';
    };
    return Route;
})();
module.exports = Route;
},{"./Segment":29}],28:[function(_dereq_,module,exports){
var Route = _dereq_('./Route');
var Router = (function () {
    function Router() {
        this.routes = [];
    }
    Router.prototype.addRoute = function (path, defaults) {
        path = path.slice(-1) === '/' ? path.substring(0, path.length - 1) : path;
        path = path.substring(0, 1) === '/' ? path.substring(1) : path;
        var route = new Route(path, defaults);
        this.routes.push(route);
        return route;
    };
    Router.prototype.match = function (path, urlDecode) {
        path = path.slice(-1) === '/' ? path.substring(0, path.length - 1) : path;
        path = (path.substring(0, 1) === '/' || path.length === 0) ? path : '/' + path;
        for (var i = 0; i < this.routes.length; i++) {
            var route = this.routes[i];
            var data = route.match(path, urlDecode);
            if (data)
                return { route: route, data: data };
        }
        return null;
    };
    Router.prototype.sort = function (compare) {
        this.routes.sort(compare);
    };
    return Router;
})();
module.exports = Router;
},{"./Route":27}],29:[function(_dereq_,module,exports){
var Segment = (function () {
    function Segment(path, optional, defaults) {
        this.pattern = '';
        this.params = [];
        this.subSegments = [];
        this.subSegmentPattern = /[{]{0,1}[^{}]+[}]{0,1}/g;
        this.escapePattern = /[\.+*\^$\[\](){}']/g;
        this.path = path;
        this.optional = optional;
        this.parse(defaults);
    }
    Segment.prototype.parse = function (defaults) {
        if (this.path.length === 0)
            return;
        var matches = this.path.match(this.subSegmentPattern);
        for (var i = 0; i < matches.length; i++) {
            var subSegment = matches[i];
            if (subSegment.charAt(0) == '{') {
                var param = subSegment.substring(1, subSegment.length - 1);
                var optional = param.slice(-1) === '?';
                var splat = param.slice(0, 1) === '*';
                var name = optional ? param.slice(0, -1) : param;
                name = splat ? name.slice(1) : name;
                this.params.push({ name: name, splat: splat });
                this.subSegments.push({ name: name, param: true, splat: splat });
                var optionalOrDefault = optional || defaults[name];
                this.optional = this.optional && this.path.length === subSegment.length && optionalOrDefault;
                var subPattern = !splat ? '[^/]+' : '.+';
                this.pattern += !this.optional ? "(" + subPattern + ")" : "(/" + subPattern + ")?";
            }
            else {
                this.optional = false;
                this.subSegments.push({ name: subSegment, param: false, splat: false });
                this.pattern += subSegment.replace(this.escapePattern, '\\$&');
            }
        }
        if (!this.optional)
            this.pattern = '\/' + this.pattern;
    };
    Segment.prototype.build = function (data, defaults, urlEncode) {
        var routePath = '';
        var optional = this.optional;
        var blank = false;
        for (var i = 0; i < this.subSegments.length; i++) {
            var subSegment = this.subSegments[i];
            if (!subSegment.param) {
                routePath += subSegment.name;
            }
            else {
                var val = data[subSegment.name];
                var defaultVal = defaults[subSegment.name];
                optional = optional && (!val || val === defaultVal);
                val = val ? val : defaultVal;
                blank = blank || !val;
                if (val) {
                    if (!subSegment.splat || typeof val === 'string') {
                        routePath += urlEncode(subSegment.name, val);
                    }
                    else {
                        var encodedVals = [];
                        for (var i = 0; i < val.length; i++)
                            encodedVals[i] = urlEncode(subSegment.name, val[i]);
                        routePath += encodedVals.join('/');
                        if (routePath.slice(-1) === '/')
                            routePath += '/';
                    }
                }
            }
        }
        return { path: !blank ? routePath : null, optional: optional };
    };
    return Segment;
})();
module.exports = Segment;
},{}]},{},[4])(4)
});