/**
 * Navigation v1.2.0
 * (c) Graham Mendick - http://grahammendick.github.io/navigation/
 * License: Apache License 2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Navigation = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var StateContext = _dereq_('./StateContext');
var StateController = _dereq_('./StateController');
var Dialog = _dereq_('./config/Dialog');
var State = _dereq_('./config/State');
var Transition = _dereq_('./config/Transition');
var StateInfoConfig = _dereq_('./config/StateInfoConfig');
var HistoryAction = _dereq_('./history/HistoryAction');
var HistoryNavigator = _dereq_('./history/HistoryNavigator');
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
var settings = _dereq_('./settings');
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
    Navigation.settings = settings;
    Navigation.start = function (url) {
        settings.historyManager.init();
        StateController.navigateLink(url ? url : settings.historyManager.getCurrentUrl());
    };
    return Navigation;
})();
HistoryNavigator.navigateHistory = function () {
    if (StateContext.url === settings.historyManager.getCurrentUrl())
        return;
    StateController.navigateLink(settings.historyManager.getCurrentUrl(), true);
};
module.exports = Navigation;
},{"./Crumb":5,"./CrumbTrailPersister":7,"./NavigationSettings":9,"./StateContext":12,"./StateController":13,"./StateHandler":14,"./StateRouter":15,"./StorageCrumbTrailPersister":16,"./config/Dialog":19,"./config/State":20,"./config/StateInfoConfig":21,"./config/Transition":22,"./history/HTML5HistoryManager":23,"./history/HashHistoryManager":24,"./history/HistoryAction":25,"./history/HistoryNavigator":26,"./routing/Route":27,"./routing/Router":28,"./settings":30}],2:[function(_dereq_,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TypeConverter = _dereq_('./TypeConverter');
var ArrayConverter = (function (_super) {
    __extends(ArrayConverter, _super);
    function ArrayConverter(converter) {
        _super.call(this);
        this.converter = converter;
    }
    ArrayConverter.prototype.getType = function () {
        return this.converter.getType() + 'array';
    };
    ArrayConverter.prototype.convertFrom = function (val) {
        var arr = [];
        if (val.length !== 0) {
            var vals = val.split(ArrayConverter.SEPARATOR1);
            for (var i = 0; i < vals.length; i++) {
                if (vals[i].length !== 0)
                    arr.push(this.converter.convertFrom(vals[i].replace(new RegExp(ArrayConverter.SEPARATOR2, 'g'), ArrayConverter.SEPARATOR)));
                else
                    arr.push(null);
            }
        }
        return arr;
    };
    ArrayConverter.prototype.convertTo = function (val) {
        var formatArray = [];
        var arr = val;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != null)
                formatArray.push(this.converter.convertTo(arr[i]).replace(new RegExp(ArrayConverter.SEPARATOR, 'g'), ArrayConverter.SEPARATOR2));
        }
        return formatArray.join(ArrayConverter.SEPARATOR1);
    };
    ArrayConverter.SEPARATOR = '-';
    ArrayConverter.SEPARATOR1 = '1-';
    ArrayConverter.SEPARATOR2 = '2-';
    return ArrayConverter;
})(TypeConverter);
module.exports = ArrayConverter;
},{"./TypeConverter":18}],3:[function(_dereq_,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TypeConverter = _dereq_('./TypeConverter');
var BooleanConverter = (function (_super) {
    __extends(BooleanConverter, _super);
    function BooleanConverter() {
        _super.apply(this, arguments);
    }
    BooleanConverter.prototype.getType = function () {
        return 'boolean';
    };
    BooleanConverter.prototype.convertFrom = function (val) {
        if (val !== 'true' && val !== 'false')
            throw Error(val + ' is not a valid boolean');
        return val === 'true';
    };
    BooleanConverter.prototype.convertTo = function (val) {
        return val.toString();
    };
    return BooleanConverter;
})(TypeConverter);
module.exports = BooleanConverter;
},{"./TypeConverter":18}],4:[function(_dereq_,module,exports){
var ArrayConverter = _dereq_('./ArrayConverter');
var BooleanConverter = _dereq_('./BooleanConverter');
var NumberConverter = _dereq_('./NumberConverter');
var StringConverter = _dereq_('./StringConverter');
var ConverterFactory = (function () {
    function ConverterFactory() {
    }
    ConverterFactory.init = function () {
        this.typeArray = [];
        this.typeArray.push(function () { return new StringConverter(); });
        this.typeArray.push(function () { return new BooleanConverter(); });
        this.typeArray.push(function () { return new NumberConverter(); });
        this.keyToConverterList = {};
        this.typeToKeyList = {};
        for (var i = 0; i < this.typeArray.length; i++) {
            this.keyToConverterList[i.toString()] = this.typeArray[i]();
            this.keyToConverterList['a' + i] = new ArrayConverter(this.typeArray[i]());
            this.typeToKeyList[this.typeArray[i]().getType()] = i.toString();
            this.typeToKeyList[new ArrayConverter(this.typeArray[i]()).getType()] = 'a' + i;
        }
    };
    ConverterFactory.getKey = function (type) {
        return this.typeToKeyList[type];
    };
    ConverterFactory.getKeyFromObject = function (obj) {
        var fullType = typeof obj;
        var type2;
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            var arr = obj;
            type2 = 'string';
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != null) {
                    type2 = typeof arr[i];
                    break;
                }
            }
            fullType = type2 + 'array';
        }
        if (!this.typeToKeyList[fullType])
            throw new Error('No TypeConverter found for ' + !type2 ? fullType : type2);
        return this.typeToKeyList[fullType];
    };
    ConverterFactory.getConverter = function (key) {
        return this.keyToConverterList[key];
    };
    return ConverterFactory;
})();
ConverterFactory.init();
module.exports = ConverterFactory;
},{"./ArrayConverter":2,"./BooleanConverter":3,"./NumberConverter":10,"./StringConverter":17}],5:[function(_dereq_,module,exports){
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
},{"./NavigationData":8}],6:[function(_dereq_,module,exports){
var Crumb = _dereq_('./Crumb');
var NavigationData = _dereq_('./NavigationData');
var ReturnDataManager = _dereq_('./ReturnDataManager');
var settings = _dereq_('./settings');
var StateContext = _dereq_('./StateContext');
var StateInfoConfig = _dereq_('./config/StateInfoConfig');
var CrumbTrailManager = (function () {
    function CrumbTrailManager() {
    }
    CrumbTrailManager.buildCrumbTrail = function (uncombined) {
        var crumbs = this.getCrumbs(false);
        if (uncombined)
            crumbs.push(new Crumb(StateContext.previousData, StateContext.previousState, this.getHref(StateContext.previousState, StateContext.previousData, null), false));
        crumbs = StateContext.state.stateHandler.truncateCrumbTrail(StateContext.state, crumbs);
        if (settings.combineCrumbTrail)
            crumbs.push(new Crumb(StateContext.data, StateContext.state, this.getHref(StateContext.state, StateContext.data, null), false));
        crumbs.reverse();
        var trailString = '';
        for (var i = 0; i < crumbs.length; i++) {
            trailString += this.CRUMB_1_SEP + crumbs[i].state.id + this.CRUMB_2_SEP;
            trailString += ReturnDataManager.formatReturnData(crumbs[i].state, crumbs[i].data);
        }
        this.crumbTrail = trailString ? trailString : null;
        this.crumbTrailKey = settings.crumbTrailPersister.save(this.crumbTrail);
    };
    CrumbTrailManager.getCrumbs = function (setLast, skipLatest) {
        var crumbTrailArray = [];
        var arrayCount = 0;
        var trail = this.crumbTrail;
        var crumbTrailSize = !trail ? 0 : trail.split(this.CRUMB_1_SEP).length - 1;
        var last = true;
        while (arrayCount < crumbTrailSize) {
            var stateKey = trail.substring(this.CRUMB_1_SEP.length).split(this.CRUMB_2_SEP)[0];
            var state = this.getState(stateKey);
            var navigationData = {};
            var data = trail.substring((trail.indexOf(this.CRUMB_2_SEP) + this.CRUMB_2_SEP.length)).split(this.CRUMB_1_SEP)[0];
            if (data)
                navigationData = ReturnDataManager.parseReturnData(data, state);
            var nextTrailStart = trail.indexOf(this.CRUMB_1_SEP, 1);
            trail = nextTrailStart != -1 ? trail.substring(nextTrailStart) : '';
            if (!skipLatest) {
                crumbTrailArray.push(new Crumb(navigationData, state, this.getHref(state, navigationData, null), setLast && last));
                last = false;
            }
            skipLatest = false;
            arrayCount++;
        }
        crumbTrailArray.reverse();
        return crumbTrailArray;
    };
    CrumbTrailManager.getState = function (id) {
        if (!id)
            return null;
        var ids = id.split('-');
        return StateInfoConfig._dialogs[+ids[0]]._states[+ids[1]];
    };
    CrumbTrailManager.getHref = function (state, navigationData, returnData) {
        var data = {};
        data[settings.stateIdKey] = state.id;
        if (!settings.combineCrumbTrail && state.trackCrumbTrail && StateContext.state)
            data[settings.previousStateIdKey] = StateContext.state.id;
        if (!settings.router.supportsDefaults) {
            navigationData = NavigationData.clone(navigationData);
            NavigationData.setDefaults(navigationData, state.defaults);
        }
        for (var key in navigationData) {
            var val = navigationData[key];
            if (val != null && val.toString()) {
                val = ReturnDataManager.formatURLObject(key, val, state);
                if (!settings.router.supportsDefaults || val !== state.formattedDefaults[key])
                    data[key] = val;
            }
        }
        if (!settings.combineCrumbTrail && state.trackCrumbTrail && StateContext.state) {
            if (settings.trackAllPreviousData)
                returnData = StateContext.data;
            var returnDataString = ReturnDataManager.formatReturnData(StateContext.state, returnData);
            if (returnDataString)
                data[settings.returnDataKey] = returnDataString;
        }
        if (this.crumbTrailKey && state.trackCrumbTrail)
            data[settings.crumbTrailKey] = this.crumbTrailKey;
        return state.stateHandler.getNavigationLink(state, data);
    };
    CrumbTrailManager.getRefreshHref = function (refreshData) {
        return this.getHref(StateContext.state, refreshData, null);
    };
    CrumbTrailManager.CRUMB_1_SEP = '4_';
    CrumbTrailManager.CRUMB_2_SEP = '5_';
    return CrumbTrailManager;
})();
module.exports = CrumbTrailManager;
},{"./Crumb":5,"./NavigationData":8,"./ReturnDataManager":11,"./StateContext":12,"./config/StateInfoConfig":21,"./settings":30}],7:[function(_dereq_,module,exports){
var CrumbTrailPersister = (function () {
    function CrumbTrailPersister() {
    }
    CrumbTrailPersister.prototype.load = function (crumbTrail) {
        return crumbTrail;
    };
    CrumbTrailPersister.prototype.save = function (crumbTrail) {
        return crumbTrail;
    };
    return CrumbTrailPersister;
})();
module.exports = CrumbTrailPersister;
},{}],8:[function(_dereq_,module,exports){
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
},{}],9:[function(_dereq_,module,exports){
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
        this.combineCrumbTrail = false;
        this.trackAllPreviousData = true;
    }
    return NavigationSettings;
})();
module.exports = NavigationSettings;
},{"./CrumbTrailPersister":7,"./StateRouter":15,"./history/HashHistoryManager":24}],10:[function(_dereq_,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TypeConverter = _dereq_('./TypeConverter');
var NumberConverter = (function (_super) {
    __extends(NumberConverter, _super);
    function NumberConverter() {
        _super.apply(this, arguments);
    }
    NumberConverter.prototype.getType = function () {
        return 'number';
    };
    NumberConverter.prototype.convertFrom = function (val) {
        if (isNaN(+val))
            throw Error(val + ' is not a valid number');
        return +val;
    };
    NumberConverter.prototype.convertTo = function (val) {
        return val.toString();
    };
    return NumberConverter;
})(TypeConverter);
module.exports = NumberConverter;
},{"./TypeConverter":18}],11:[function(_dereq_,module,exports){
var ConverterFactory = _dereq_('./ConverterFactory');
var settings = _dereq_('./settings');
var ReturnDataManager = (function () {
    function ReturnDataManager() {
    }
    ReturnDataManager.formatReturnData = function (state, returnData) {
        var returnDataArray = [];
        for (var key in returnData) {
            if (returnData[key] != null && returnData[key].toString()) {
                var val = this.formatURLObject(key, returnData[key], state, true);
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
    ReturnDataManager.formatURLObject = function (key, urlObject, state, encode) {
        encode = encode || state.trackTypes;
        var defaultType = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
        var converterKey = ConverterFactory.getKeyFromObject(urlObject);
        var formattedValue = ConverterFactory.getConverter(converterKey).convertTo(urlObject);
        if (encode)
            formattedValue = this.encodeUrlValue(formattedValue);
        if (state.trackTypes && typeof urlObject !== defaultType)
            formattedValue += this.RET_2_SEP + converterKey;
        return formattedValue;
    };
    ReturnDataManager.parseURLString = function (key, val, state, decode) {
        decode = decode || state.trackTypes;
        var defaultType = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
        var urlValue = val;
        var converterKey = ConverterFactory.getKey(defaultType);
        if (state.trackTypes && val.indexOf(this.RET_2_SEP) > -1) {
            var arr = val.split(this.RET_2_SEP);
            urlValue = arr[0];
            converterKey = arr[1];
        }
        if (decode)
            urlValue = this.decodeUrlValue(urlValue);
        return ConverterFactory.getConverter(converterKey).convertFrom(urlValue);
    };
    ReturnDataManager.parseReturnData = function (returnData, state) {
        var navigationData = {};
        var returnDataArray = returnData.split(this.RET_3_SEP);
        for (var i = 0; i < returnDataArray.length; i++) {
            var nameValuePair = returnDataArray[i].split(this.RET_1_SEP);
            navigationData[this.decodeUrlValue(nameValuePair[0])] = this.parseURLString(this.decodeUrlValue(nameValuePair[0]), nameValuePair[1], state, true);
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
},{"./ConverterFactory":4,"./settings":30}],12:[function(_dereq_,module,exports){
var StateContext = (function () {
    function StateContext() {
    }
    StateContext.includeCurrentData = function (data, keys) {
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
    StateContext.clear = function (key) {
        if (key)
            this.data[key] = this.state.defaults[key];
        else {
            for (var dataKey in this.data) {
                this.data[dataKey] = this.state.defaults[dataKey];
            }
        }
    };
    StateContext.oldData = {};
    StateContext.previousData = {};
    StateContext.data = {};
    return StateContext;
})();
module.exports = StateContext;
},{}],13:[function(_dereq_,module,exports){
var CrumbTrailManager = _dereq_('./CrumbTrailManager');
var HistoryAction = _dereq_('./history/HistoryAction');
var NavigationData = _dereq_('./NavigationData');
var ReturnDataManager = _dereq_('./ReturnDataManager');
var settings = _dereq_('./settings');
var StateContext = _dereq_('./StateContext');
var StateInfoConfig = _dereq_('./config/StateInfoConfig');
var StateController = (function () {
    function StateController() {
    }
    StateController.setStateContext = function (state, url) {
        try {
            this.setOldStateContext();
            StateContext.state = state;
            StateContext.url = url;
            StateContext.dialog = state.parent;
            StateContext.title = state.title;
            var data = state.stateHandler.getNavigationData(state, url);
            StateContext.data = this.parseData(data, state);
            StateContext.previousState = null;
            StateContext.previousDialog = null;
            StateContext.previousData = {};
            CrumbTrailManager.crumbTrail = settings.crumbTrailPersister.load(data[settings.crumbTrailKey]);
            var uncombined = !!data[settings.previousStateIdKey];
            this.setPreviousStateContext(uncombined, data);
            CrumbTrailManager.buildCrumbTrail(uncombined);
            this.crumbs = CrumbTrailManager.getCrumbs(true, settings.combineCrumbTrail);
        }
        catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
    };
    StateController.clearStateContext = function () {
        StateContext.oldState = null;
        StateContext.oldDialog = null;
        StateContext.oldData = {};
        StateContext.previousState = null;
        StateContext.previousDialog = null;
        StateContext.previousData = {};
        StateContext.state = null;
        StateContext.dialog = null;
        StateContext.data = {};
        StateContext.url = null;
        StateContext.title = null;
        CrumbTrailManager.crumbTrail = null;
        CrumbTrailManager.crumbTrailKey = null;
    };
    StateController.setOldStateContext = function () {
        if (StateContext.state) {
            StateContext.oldState = StateContext.state;
            StateContext.oldDialog = StateContext.dialog;
            StateContext.oldData = NavigationData.clone(StateContext.data);
            NavigationData.setDefaults(StateContext.oldData, StateContext.oldState.defaults);
        }
    };
    StateController.setPreviousStateContext = function (uncombined, data) {
        if (uncombined) {
            StateContext.previousState = CrumbTrailManager.getState(data[settings.previousStateIdKey]);
            if (StateContext.previousState)
                StateContext.previousDialog = StateContext.previousState.parent;
            if (data[settings.returnDataKey])
                StateContext.previousData = ReturnDataManager.parseReturnData(data[settings.returnDataKey], StateContext.previousState);
        }
        else {
            var previousStateCrumb = CrumbTrailManager.getCrumbs(false).pop();
            if (previousStateCrumb) {
                StateContext.previousState = previousStateCrumb.state;
                StateContext.previousDialog = StateContext.previousState.parent;
                StateContext.previousData = previousStateCrumb.data;
            }
        }
    };
    StateController.onNavigate = function (handler) {
        if (!handler[this.NAVIGATE_HANDLER_ID]) {
            var id = this.NAVIGATE_HANDLER_ID + this.navigateHandlerId++;
            handler[this.NAVIGATE_HANDLER_ID] = id;
            this.navigateHandlers[id] = handler;
        }
    };
    StateController.offNavigate = function (handler) {
        delete this.navigateHandlers[handler[this.NAVIGATE_HANDLER_ID]];
        delete handler[this.NAVIGATE_HANDLER_ID];
    };
    StateController.navigate = function (action, toData, historyAction) {
        var url = this.getNavigationLink(action, toData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, this.getNextState(action), false, historyAction);
    };
    StateController.getNavigationLink = function (action, toData) {
        return CrumbTrailManager.getHref(this.getNextState(action), toData, StateContext.data);
    };
    StateController.canNavigateBack = function (distance) {
        var canNavigate = false;
        if (distance <= this.crumbs.length && distance > 0)
            canNavigate = true;
        return canNavigate;
    };
    StateController.navigateBack = function (distance, historyAction) {
        var url = this.getNavigationBackLink(distance);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, this.getCrumb(distance).state, false, historyAction);
    };
    StateController.getNavigationBackLink = function (distance) {
        return this.getCrumb(distance).navigationLink;
    };
    StateController.refresh = function (toData, historyAction) {
        var url = this.getRefreshLink(toData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, StateContext.state, false, historyAction);
    };
    StateController.getRefreshLink = function (toData) {
        return CrumbTrailManager.getRefreshHref(toData);
    };
    StateController.navigateLink = function (url, history, historyAction) {
        try {
            var state = settings.router.getData(url.split('?')[0]).state;
        }
        catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
        this._navigateLink(url, state, history, historyAction);
    };
    StateController._navigateLink = function (url, state, history, historyAction) {
        if (history === void 0) { history = false; }
        if (historyAction === void 0) { historyAction = HistoryAction.Add; }
        try {
            var oldUrl = StateContext.url;
            var data = state.stateHandler.getNavigationData(state, url);
            data = this.parseData(data, state);
        }
        catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
        var navigateContinuation = this.getNavigateContinuation(oldUrl, state, url, historyAction);
        var unloadContinuation = function () {
            if (oldUrl === StateContext.url)
                state.navigating(data, url, navigateContinuation, history);
        };
        if (StateContext.state)
            StateContext.state.unloading(state, data, url, unloadContinuation, history);
        else
            state.navigating(data, url, navigateContinuation, history);
    };
    StateController.getNavigateContinuation = function (oldUrl, state, url, historyAction) {
        var _this = this;
        return function (asyncData) {
            if (oldUrl === StateContext.url) {
                state.stateHandler.navigateLink(StateContext.oldState, state, url);
                StateController.setStateContext(state, url);
                if (StateContext.oldState && StateContext.oldState !== state)
                    StateContext.oldState.dispose();
                state.navigated(StateContext.data, asyncData);
                for (var id in _this.navigateHandlers) {
                    if (url === StateContext.url)
                        _this.navigateHandlers[id](StateContext.oldState, state, StateContext.data);
                }
                if (url === StateContext.url) {
                    if (historyAction !== HistoryAction.None)
                        settings.historyManager.addHistory(state, url, historyAction === HistoryAction.Replace);
                    if (StateContext.title && (typeof document !== 'undefined'))
                        document.title = StateContext.title;
                }
            }
        };
    };
    StateController.parseData = function (data, state) {
        var newData = {};
        for (var key in data) {
            if (key !== settings.previousStateIdKey && key !== settings.returnDataKey && key !== settings.crumbTrailKey)
                newData[key] = ReturnDataManager.parseURLString(key, data[key], state);
        }
        NavigationData.setDefaults(newData, state.defaults);
        return newData;
    };
    StateController.getNextState = function (action) {
        var nextState = null;
        if (StateContext.state && StateContext.state.transitions[action])
            nextState = StateContext.state.transitions[action].to;
        if (!nextState && StateInfoConfig.dialogs[action])
            nextState = StateInfoConfig.dialogs[action].initial;
        if (!nextState)
            throw new Error('The action parameter must be a Dialog key or a Transition key that is a child of the current State');
        return nextState;
    };
    StateController.getCrumb = function (distance) {
        if (distance > this.crumbs.length || distance <= 0)
            throw new Error('The distance parameter must be greater than zero and less than or equal to the number of Crumbs (' + this.crumbs.length + ')');
        return this.crumbs[this.crumbs.length - distance];
    };
    StateController.NAVIGATE_HANDLER_ID = 'navigateHandlerId';
    StateController.navigateHandlerId = 1;
    StateController.navigateHandlers = {};
    return StateController;
})();
module.exports = StateController;
},{"./CrumbTrailManager":6,"./NavigationData":8,"./ReturnDataManager":11,"./StateContext":12,"./config/StateInfoConfig":21,"./history/HistoryAction":25,"./settings":30}],14:[function(_dereq_,module,exports){
var settings = _dereq_('./settings');
var StateHandler = (function () {
    function StateHandler() {
    }
    StateHandler.prototype.getNavigationLink = function (state, data) {
        var routeInfo = settings.router.getRoute(state, data);
        if (routeInfo.route == null)
            return null;
        var query = [];
        for (var key in data) {
            if (key !== settings.stateIdKey && !routeInfo.data[key])
                query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        if (query.length > 0)
            routeInfo.route += '?' + query.join('&');
        return routeInfo.route;
    };
    StateHandler.prototype.navigateLink = function (oldState, state, url) {
    };
    StateHandler.prototype.getNavigationData = function (state, url) {
        var queryIndex = url.indexOf('?');
        var data = settings.router.getData(queryIndex < 0 ? url : url.substring(0, queryIndex)).data;
        data = data ? data : {};
        if (queryIndex >= 0) {
            var query = url.substring(queryIndex + 1);
            var params = query.split('&');
            for (var i = 0; i < params.length; i++) {
                var param = params[i].split('=');
                data[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
            }
        }
        return data;
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
},{"./settings":30}],15:[function(_dereq_,module,exports){
var Router = _dereq_('./routing/Router');
var StateRouter = (function () {
    function StateRouter() {
        this.supportsDefaults = true;
    }
    StateRouter.prototype.getData = function (route) {
        var match = this.router.match(route);
        return { state: match.route['_state'], data: this.router.match(route).data };
    };
    StateRouter.prototype.getRoute = function (state, data) {
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
            routePath = routeMatch.route.build(data);
        }
        else {
            var bestMatch = StateRouter.findBestMatch(routeInfo.routes, data);
            if (bestMatch) {
                routePath = bestMatch.routePath;
                routeMatch = { route: bestMatch.route, data: bestMatch.data };
                routeInfo.matches[paramsKey] = routeMatch;
            }
        }
        return { route: routePath, data: routeMatch ? routeMatch.data : {} };
    };
    StateRouter.findBestMatch = function (routes, data) {
        var bestMatch;
        var bestMatchCount = -1;
        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            var routePath = route.build(data);
            if (routePath) {
                var count = 0;
                var routeData = {};
                for (var j = 0; j < route.params.length; j++) {
                    if (data[route.params[j].name]) {
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
            for (var j = 0; j < route.params.length; j++) {
                var param = route.params[j];
                if (!routeInfo.params[param.name]) {
                    routeInfo.params[param.name] = count;
                    count++;
                }
            }
            routeInfo.routes.push(route);
            route['_state'] = state;
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
},{"./routing/Router":28}],16:[function(_dereq_,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CrumbTrailPersister = _dereq_('./CrumbTrailPersister');
var StateContext = _dereq_('./StateContext');
var settings = _dereq_('./settings');
var StorageCrumbTrailPersister = (function (_super) {
    __extends(StorageCrumbTrailPersister, _super);
    function StorageCrumbTrailPersister(maxLength, historySize, storage) {
        if (maxLength === void 0) { maxLength = 500; }
        if (historySize === void 0) { historySize = 100; }
        _super.call(this);
        settings.combineCrumbTrail = true;
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
    StorageCrumbTrailPersister.prototype.save = function (crumbTrail) {
        if (!crumbTrail)
            return crumbTrail;
        if (crumbTrail.length > this.maxLength) {
            var count = 0;
            if (this.storage.getItem('CrumbTrailCount') != null)
                count = +this.storage.getItem('CrumbTrailCount');
            var dialogCode = StorageCrumbTrailPersister.toCode(StateContext.dialog.index);
            var stateCode = StorageCrumbTrailPersister.toCode(StateContext.state.index);
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
},{"./CrumbTrailPersister":7,"./StateContext":12,"./settings":30}],17:[function(_dereq_,module,exports){
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TypeConverter = _dereq_('./TypeConverter');
var StringConverter = (function (_super) {
    __extends(StringConverter, _super);
    function StringConverter() {
        _super.apply(this, arguments);
    }
    StringConverter.prototype.getType = function () {
        return 'string';
    };
    StringConverter.prototype.convertFrom = function (val) {
        return val;
    };
    StringConverter.prototype.convertTo = function (val) {
        return val.toString();
    };
    return StringConverter;
})(TypeConverter);
module.exports = StringConverter;
},{"./TypeConverter":18}],18:[function(_dereq_,module,exports){
var TypeConverter = (function () {
    function TypeConverter() {
    }
    TypeConverter.prototype.getType = function () {
        return null;
    };
    TypeConverter.prototype.convertFrom = function (val) {
        return null;
    };
    TypeConverter.prototype.convertTo = function (val) {
        return null;
    };
    return TypeConverter;
})();
module.exports = TypeConverter;
},{}],19:[function(_dereq_,module,exports){
var Dialog = (function () {
    function Dialog() {
        this._states = [];
        this.states = {};
    }
    return Dialog;
})();
module.exports = Dialog;
},{}],20:[function(_dereq_,module,exports){
var StateHandler = _dereq_('../StateHandler');
var State = (function () {
    function State() {
        this._transitions = [];
        this.transitions = {};
        this.defaults = {};
        this.defaultTypes = {};
        this.formattedDefaults = {};
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
},{"../StateHandler":14}],21:[function(_dereq_,module,exports){
var Dialog = _dereq_('./Dialog');
var ReturnDataManager = _dereq_('../ReturnDataManager');
var settings = _dereq_('../settings');
var State = _dereq_('./State');
var Transition = _dereq_('./Transition');
var StateInfoConfig = (function () {
    function StateInfoConfig() {
    }
    StateInfoConfig.build = function (dialogs) {
        this._dialogs = [];
        this.dialogs = {};
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
            if (this.dialogs[dialog.key])
                throw new Error('A Dialog with key ' + dialog.key + ' already exists');
            this._dialogs.push(dialog);
            this.dialogs[dialog.key] = dialog;
            this.processStates(dialog, dialogObject);
            this.processTransitions(dialog, dialogObject);
            dialog.initial = dialog.states[dialogObject.initial];
            if (!dialogObject.initial)
                throw new Error('initial is mandatory for a Dialog');
            if (!dialog.initial)
                throw new Error(dialog.key + ' Dialog\'s initial key of ' + dialogObject.initial + ' does not match a child State key');
        }
        settings.router.addRoutes(this._dialogs);
    };
    StateInfoConfig.processStates = function (dialog, dialogObject) {
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
                    state.defaultTypes[key] = typeof state.defaults[key];
                state.formattedDefaults[key] = ReturnDataManager.formatURLObject(key, state.defaults[key], state);
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
    StateInfoConfig._dialogs = [];
    StateInfoConfig.dialogs = {};
    return StateInfoConfig;
})();
module.exports = StateInfoConfig;
},{"../ReturnDataManager":11,"../settings":30,"./Dialog":19,"./State":20,"./Transition":22}],22:[function(_dereq_,module,exports){
var Transition = (function () {
    function Transition() {
    }
    return Transition;
})();
module.exports = Transition;
},{}],23:[function(_dereq_,module,exports){
var HistoryNavigator = _dereq_('./HistoryNavigator');
var settings = _dereq_('../settings');
var StateContext = _dereq_('../StateContext');
var HTML5HistoryManager = (function () {
    function HTML5HistoryManager() {
        this.disabled = (typeof window === 'undefined') || !(window.history && window.history.pushState);
    }
    HTML5HistoryManager.prototype.init = function () {
        if (!this.disabled)
            window.addEventListener('popstate', HistoryNavigator.navigateHistory);
    };
    HTML5HistoryManager.prototype.addHistory = function (state, url, replace) {
        url = url != null ? url : StateContext.url;
        url = settings.applicationPath + url;
        if (!this.disabled && location.pathname + location.search !== url) {
            if (!replace)
                window.history.pushState(null, null, url);
            else
                window.history.replaceState(null, null, url);
        }
    };
    HTML5HistoryManager.prototype.getCurrentUrl = function () {
        return location.pathname.substring(settings.applicationPath.length) + location.search;
    };
    HTML5HistoryManager.prototype.getHref = function (url) {
        if (!url)
            throw new Error('The Url is invalid');
        return settings.applicationPath + url;
    };
    HTML5HistoryManager.prototype.getUrl = function (anchor) {
        return anchor.pathname.substring(settings.applicationPath.length) + anchor.search;
    };
    return HTML5HistoryManager;
})();
module.exports = HTML5HistoryManager;
},{"../StateContext":12,"../settings":30,"./HistoryNavigator":26}],24:[function(_dereq_,module,exports){
var HistoryNavigator = _dereq_('./HistoryNavigator');
var StateContext = _dereq_('../StateContext');
var HashHistoryManager = (function () {
    function HashHistoryManager() {
        this.disabled = (typeof window === 'undefined') || !('onhashchange' in window);
        this.replaceQueryIdentifier = false;
    }
    HashHistoryManager.prototype.init = function () {
        if (!this.disabled) {
            if (window.addEventListener)
                window.addEventListener('hashchange', HistoryNavigator.navigateHistory);
            else
                window['attachEvent']('onhashchange', HistoryNavigator.navigateHistory);
        }
    };
    HashHistoryManager.prototype.addHistory = function (state, url, replace) {
        url = url != null ? url : StateContext.url;
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
},{"../StateContext":12,"./HistoryNavigator":26}],25:[function(_dereq_,module,exports){
var HistoryAction;
(function (HistoryAction) {
    HistoryAction[HistoryAction["Add"] = 0] = "Add";
    HistoryAction[HistoryAction["Replace"] = 1] = "Replace";
    HistoryAction[HistoryAction["None"] = 2] = "None";
})(HistoryAction || (HistoryAction = {}));
module.exports = HistoryAction;
},{}],26:[function(_dereq_,module,exports){
var HistoryNavigator = (function () {
    function HistoryNavigator() {
    }
    return HistoryNavigator;
})();
module.exports = HistoryNavigator;
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
                params.push({ name: segment.params[j], optional: segment.optional });
            }
            this.params = params.concat(this.params);
        }
        this.pattern = new RegExp('^' + pattern + '$', 'i');
    };
    Route.prototype.match = function (path) {
        var matches = this.pattern.exec(path);
        if (!matches)
            return null;
        var data = {};
        for (var i = 1; i < matches.length; i++) {
            var param = this.params[i - 1];
            if (matches[i])
                data[param.name] = decodeURIComponent(!param.optional ? matches[i] : matches[i].substring(1));
        }
        return data;
    };
    Route.prototype.build = function (data) {
        data = data != null ? data : {};
        var route = '';
        var optional = true;
        for (var i = this.segments.length - 1; i >= 0; i--) {
            var segment = this.segments[i];
            var pathInfo = segment.build(data);
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
    Router.prototype.match = function (path) {
        path = path.slice(-1) === '/' ? path.substring(0, path.length - 1) : path;
        path = (path.substring(0, 1) === '/' || path.length === 0) ? path : '/' + path;
        for (var i = 0; i < this.routes.length; i++) {
            var route = this.routes[i];
            var data = route.match(path);
            if (data) {
                for (var key in route.defaults) {
                    if (!data[key])
                        data[key] = route.defaults[key];
                }
                return { route: route, data: data };
            }
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
        this.defaults = defaults;
        this.parse();
    }
    Segment.prototype.parse = function () {
        if (this.path.length === 0)
            return;
        var matches = this.path.match(this.subSegmentPattern);
        for (var i = 0; i < matches.length; i++) {
            var subSegment = matches[i];
            if (subSegment.charAt(0) == '{') {
                var param = subSegment.substring(1, subSegment.length - 1);
                var name = param.slice(-1) === '?' ? param.slice(0, -1) : param;
                this.params.push(name);
                this.subSegments.push({ name: name, param: true });
                var optionalOrDefault = param.slice(-1) === '?' || this.defaults[name];
                this.optional = this.optional && this.path.length === subSegment.length && optionalOrDefault;
                this.pattern += !this.optional ? '([^/]+)' : '(\/[^/]+)?';
            }
            else {
                this.optional = false;
                this.subSegments.push({ name: subSegment, param: false });
                this.pattern += subSegment.replace(this.escapePattern, '\\$&');
            }
        }
        if (!this.optional)
            this.pattern = '\/' + this.pattern;
    };
    Segment.prototype.build = function (data) {
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
                var defaultVal = this.defaults[subSegment.name];
                optional = optional && (!val || val === defaultVal);
                val = val ? val : defaultVal;
                blank = blank || !val;
                routePath += encodeURIComponent(val);
            }
        }
        return { path: !blank ? routePath : null, optional: optional };
    };
    return Segment;
})();
module.exports = Segment;
},{}],30:[function(_dereq_,module,exports){
var NavigationSettings = _dereq_('./NavigationSettings');
var settings = new NavigationSettings();
module.exports = settings;
},{"./NavigationSettings":9}]},{},[1])(1)
});