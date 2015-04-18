(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NavigationRouting = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var Route = _dereq_('./Route');
var Router = _dereq_('./Router');
var NavigationRouting = (function () {
    function NavigationRouting() {
    }
    NavigationRouting.Route = Route;
    NavigationRouting.Router = Router;
    return NavigationRouting;
})();
module.exports = NavigationRouting;

},{"./Route":2,"./Router":3}],2:[function(_dereq_,module,exports){
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

},{"./Segment":4}],3:[function(_dereq_,module,exports){
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
    return Router;
})();
module.exports = Router;

},{"./Route":2}],4:[function(_dereq_,module,exports){
var Segment = (function () {
    function Segment(path, optional, defaults) {
        this.params = [];
        this.paramsPattern = /\{([^}]+)\}/g;
        this.escapePattern = /[\.+*\^$\[\](){}']/g;
        this.path = path;
        this.optional = optional;
        this.defaults = defaults;
        this.parse();
    }
    Segment.prototype.parse = function () {
        var _this = this;
        var optional = this.path.length === 0;
        var replaceParam = function (match, param) {
            var name = param.slice(-1) === '?' ? param.substring(0, param.length - 1) : param;
            _this.params.push(name);
            var optionalOrDefault = param.slice(-1) === '?' || _this.defaults[name];
            optional = _this.path.length === match.length && optionalOrDefault;
            return '?';
        };
        this.pattern = this.path.replace(this.paramsPattern, replaceParam);
        this.optional = this.optional && optional;
        this.pattern = this.pattern.replace(this.escapePattern, '\\$&');
        if (!this.optional)
            this.pattern = '\/' + this.pattern.replace(/\?/g, '([^/]+)');
        else
            this.pattern = this.pattern.replace(/\?/, '(\/[^/]+)?');
    };
    Segment.prototype.build = function (data) {
        var _this = this;
        var optional = this.optional;
        var blank = false;
        var replaceParam = function (match, param) {
            var name = param.slice(-1) === '?' ? param.substring(0, param.length - 1) : param;
            optional = optional && (!data[name] || data[name] === _this.defaults[name]);
            var val = data[name] ? data[name] : _this.defaults[name];
            blank = blank || !val;
            return encodeURIComponent(val);
        };
        var routePath = this.path.replace(this.paramsPattern, replaceParam);
        return { path: !blank ? routePath : null, optional: optional };
    };
    return Segment;
})();
module.exports = Segment;

},{}]},{},[1])(1)
});
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Navigation = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var StateContext = _dereq_('./StateContext');
var StateController = _dereq_('./StateController');
var Dialog = _dereq_('./config/Dialog');
var State = _dereq_('./config/State');
var Transition = _dereq_('./config/Transition');
var StateInfoConfig = _dereq_('./config/StateInfoConfig');
var HistoryNavigator = _dereq_('./history/HistoryNavigator');
var HashHistoryManager = _dereq_('./history/HashHistoryManager');
var HTML5HistoryManager = _dereq_('./history/HTML5HistoryManager');
var Crumb = _dereq_('./Crumb');
var StateHandler = _dereq_('./StateHandler');
var StateRouter = _dereq_('./StateRouter');
var NavigationSettings = _dereq_('./NavigationSettings');
var router = _dereq_('./router');
var settings = _dereq_('./settings');
var Navigation = (function () {
    function Navigation() {
    }
    Navigation.Dialog = Dialog;
    Navigation.State = State;
    Navigation.Transition = Transition;
    Navigation.StateInfoConfig = StateInfoConfig;
    Navigation.HashHistoryManager = HashHistoryManager;
    Navigation.HTML5HistoryManager = HTML5HistoryManager;
    Navigation.historyManager = HistoryNavigator.historyManager = new HashHistoryManager();
    Navigation.Crumb = Crumb;
    Navigation.NavigationSettings = NavigationSettings;
    Navigation.StateContext = StateContext;
    Navigation.StateController = StateController;
    Navigation.StateHandler = StateHandler;
    Navigation.StateRouter = StateRouter;
    Navigation.router = router;
    Navigation.settings = settings;
    Navigation.start = function (url) {
        HistoryNavigator.historyManager.init();
        StateController.navigateLink(url ? url : HistoryNavigator.historyManager.getCurrentUrl());
    };
    return Navigation;
})();
HistoryNavigator.navigateHistory = function () {
    if (StateContext.url === HistoryNavigator.historyManager.getCurrentUrl())
        return;
    StateController.navigateLink(HistoryNavigator.historyManager.getCurrentUrl());
};
module.exports = Navigation;

},{"./Crumb":5,"./NavigationSettings":8,"./StateContext":11,"./StateController":12,"./StateHandler":13,"./StateRouter":14,"./config/Dialog":17,"./config/State":18,"./config/StateInfoConfig":19,"./config/Transition":20,"./history/HTML5HistoryManager":21,"./history/HashHistoryManager":22,"./history/HistoryNavigator":23,"./router":24,"./settings":25}],2:[function(_dereq_,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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

},{"./TypeConverter":16}],3:[function(_dereq_,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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

},{"./TypeConverter":16}],4:[function(_dereq_,module,exports){
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

},{"./ArrayConverter":2,"./BooleanConverter":3,"./NumberConverter":9,"./StringConverter":15}],5:[function(_dereq_,module,exports){
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

},{"./NavigationData":7}],6:[function(_dereq_,module,exports){
var Crumb = _dereq_('./Crumb');
var NavigationData = _dereq_('./NavigationData');
var ReturnDataManager = _dereq_('./ReturnDataManager');
var router = _dereq_('./router');
var settings = _dereq_('./settings');
var StateContext = _dereq_('./StateContext');
var StateInfoConfig = _dereq_('./config/StateInfoConfig');
var CrumbTrailManager = (function () {
    function CrumbTrailManager() {
    }
    CrumbTrailManager.buildCrumbTrail = function () {
        var crumbs = this.getCrumbs(false);
        if (StateContext.previousState)
            crumbs.push(new Crumb(this.returnData, StateContext.previousState, this.getHref(StateContext.previousState, this.returnData, null), false));
        crumbs = StateContext.state.stateHandler.truncateCrumbTrail(StateContext.state, crumbs);
        crumbs.reverse();
        var trailString = '';
        for (var i = 0; i < crumbs.length; i++) {
            trailString += this.CRUMB_1_SEP + crumbs[i].state.id + this.CRUMB_2_SEP;
            trailString += ReturnDataManager.formatReturnData(crumbs[i].state, crumbs[i].data);
        }
        this.crumbTrail = trailString ? trailString : null;
    };
    CrumbTrailManager.getCrumbs = function (setLast) {
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
            crumbTrailArray.push(new Crumb(navigationData, state, this.getHref(state, navigationData, null), setLast && last));
            last = false;
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
        if (state.trackCrumbTrail && StateContext.state)
            data[settings.previousStateIdKey] = StateContext.state.id;
        navigationData = NavigationData.clone(navigationData);
        NavigationData.setDefaults(navigationData, state.defaults);
        for (var key in navigationData) {
            if (navigationData[key] != null && navigationData[key].toString() && (!router.supportsDefaults || navigationData[key] !== state.defaults[key]))
                data[key] = ReturnDataManager.formatURLObject(key, navigationData[key], state);
        }
        if (state.trackCrumbTrail && StateContext.state) {
            var returnDataString = ReturnDataManager.formatReturnData(StateContext.state, returnData);
            if (returnDataString)
                data[settings.returnDataKey] = returnDataString;
        }
        if (this.crumbTrail && state.trackCrumbTrail)
            data[settings.crumbTrailKey] = this.crumbTrail;
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

},{"./Crumb":5,"./NavigationData":7,"./ReturnDataManager":10,"./StateContext":11,"./config/StateInfoConfig":19,"./router":24,"./settings":25}],7:[function(_dereq_,module,exports){
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

},{}],8:[function(_dereq_,module,exports){
var NavigationSettings = (function () {
    function NavigationSettings() {
        this.stateIdKey = 'c0';
        this.previousStateIdKey = 'c1';
        this.returnDataKey = 'c2';
        this.crumbTrailKey = 'c3';
        this.applicationPath = '';
    }
    return NavigationSettings;
})();
module.exports = NavigationSettings;

},{}],9:[function(_dereq_,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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

},{"./TypeConverter":16}],10:[function(_dereq_,module,exports){
var ConverterFactory = _dereq_('./ConverterFactory');
var router = _dereq_('./router');
var ReturnDataManager = (function () {
    function ReturnDataManager() {
    }
    ReturnDataManager.formatReturnData = function (state, returnData) {
        var returnDataArray = [];
        for (var key in returnData) {
            if (returnData[key] != null && returnData[key].toString() && (!router.supportsDefaults || returnData[key] !== state.defaults[key]))
                returnDataArray.push(this.encodeUrlValue(key) + this.RET_1_SEP + this.formatURLObject(key, returnData[key], state));
        }
        return returnDataArray.join(this.RET_3_SEP);
    };
    ReturnDataManager.decodeUrlValue = function (urlValue) {
        return urlValue.replace(new RegExp('0' + this.SEPARATOR, 'g'), this.SEPARATOR);
    };
    ReturnDataManager.encodeUrlValue = function (urlValue) {
        return urlValue.replace(new RegExp(this.SEPARATOR, 'g'), '0' + this.SEPARATOR);
    };
    ReturnDataManager.formatURLObject = function (key, urlObject, state) {
        var defaultType = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
        var converterKey = ConverterFactory.getKeyFromObject(urlObject);
        var formattedValue = ConverterFactory.getConverter(converterKey).convertTo(urlObject);
        formattedValue = this.encodeUrlValue(formattedValue);
        if (typeof urlObject !== defaultType)
            formattedValue += this.RET_2_SEP + converterKey;
        return formattedValue;
    };
    ReturnDataManager.parseURLString = function (key, val, state) {
        var defaultType = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
        var urlValue = val;
        var converterKey = ConverterFactory.getKey(defaultType);
        if (val.indexOf(this.RET_2_SEP) > -1) {
            var arr = val.split(this.RET_2_SEP);
            urlValue = arr[0];
            converterKey = arr[1];
        }
        return ConverterFactory.getConverter(converterKey).convertFrom(this.decodeUrlValue(urlValue));
    };
    ReturnDataManager.parseReturnData = function (returnData, state) {
        var navigationData = {};
        var returnDataArray = returnData.split(this.RET_3_SEP);
        for (var i = 0; i < returnDataArray.length; i++) {
            var nameValuePair = returnDataArray[i].split(this.RET_1_SEP);
            navigationData[this.decodeUrlValue(nameValuePair[0])] = this.parseURLString(this.decodeUrlValue(nameValuePair[0]), nameValuePair[1], state);
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

},{"./ConverterFactory":4,"./router":24}],11:[function(_dereq_,module,exports){
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
    return StateContext;
})();
module.exports = StateContext;

},{}],12:[function(_dereq_,module,exports){
var CrumbTrailManager = _dereq_('./CrumbTrailManager');
var HistoryNavigator = _dereq_('./history/HistoryNavigator');
var NavigationData = _dereq_('./NavigationData');
var ReturnDataManager = _dereq_('./ReturnDataManager');
var router = _dereq_('./router');
var settings = _dereq_('./settings');
var StateContext = _dereq_('./StateContext');
var StateInfoConfig = _dereq_('./config/StateInfoConfig');
var StateController = (function () {
    function StateController() {
    }
    StateController.setStateContext = function (state, url) {
        try {
            StateContext.state = state;
            StateContext.url = url;
            StateContext.dialog = state.parent;
            var data = state.stateHandler.getNavigationData(state, url);
            StateContext.previousState = CrumbTrailManager.getState(data[settings.previousStateIdKey]);
            StateContext.previousDialog = null;
            if (StateContext.previousState)
                StateContext.previousDialog = StateContext.previousState.parent;
            CrumbTrailManager.returnData = {};
            if (data[settings.returnDataKey])
                CrumbTrailManager.returnData = ReturnDataManager.parseReturnData(data[settings.returnDataKey], StateContext.previousState);
            CrumbTrailManager.crumbTrail = data[settings.crumbTrailKey];
            StateContext.data = this.parseData(data, state);
            CrumbTrailManager.buildCrumbTrail();
            this.crumbs = CrumbTrailManager.getCrumbs(true);
        }
        catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
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
    StateController.navigate = function (action, toData) {
        var url = this.getNavigationLink(action, toData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, this.getNextState(action));
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
    StateController.navigateBack = function (distance) {
        var url = this.getNavigationBackLink(distance);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, this.getCrumb(distance).state);
    };
    StateController.getNavigationBackLink = function (distance) {
        return this.getCrumb(distance).navigationLink;
    };
    StateController.refresh = function (toData) {
        var url = this.getRefreshLink(toData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, StateContext.state);
    };
    StateController.getRefreshLink = function (toData) {
        return CrumbTrailManager.getRefreshHref(toData);
    };
    StateController.navigateLink = function (url) {
        try {
            var state = router.getData(url.split('?')[0]).state;
        }
        catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
        this._navigateLink(url, state);
    };
    StateController._navigateLink = function (url, state) {
        var _this = this;
        try {
            var oldUrl = StateContext.url;
            var oldState = StateContext.state;
            var data = state.stateHandler.getNavigationData(state, url);
            data = this.parseData(data, state);
        }
        catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
        state.navigating(data, url, function () {
            if (oldUrl === StateContext.url) {
                state.stateHandler.navigateLink(oldState, state, url);
                StateController.setStateContext(state, url);
                if (oldState && oldState !== state)
                    oldState.dispose();
                state.navigated(StateContext.data);
                for (var id in _this.navigateHandlers) {
                    if (url === StateContext.url)
                        _this.navigateHandlers[id](oldState, state, StateContext.data);
                }
                if (url === StateContext.url) {
                    HistoryNavigator.historyManager.addHistory(state, url);
                }
            }
        });
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

},{"./CrumbTrailManager":6,"./NavigationData":7,"./ReturnDataManager":10,"./StateContext":11,"./config/StateInfoConfig":19,"./history/HistoryNavigator":23,"./router":24,"./settings":25}],13:[function(_dereq_,module,exports){
var router = _dereq_('./router');
var settings = _dereq_('./settings');
var StateHandler = (function () {
    function StateHandler() {
    }
    StateHandler.prototype.getNavigationLink = function (state, data) {
        delete data[settings.stateIdKey];
        var routeInfo = router.getRoute(state, data);
        if (routeInfo.route == null)
            return null;
        var query = [];
        for (var key in data) {
            if (!routeInfo.data || routeInfo.data[key] == null)
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
        var data = router.getData(queryIndex < 0 ? url : url.substring(0, queryIndex)).data;
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

},{"./router":24,"./settings":25}],14:[function(_dereq_,module,exports){
(function (global){
var NavigationRouting = (typeof window !== "undefined" ? window.NavigationRouting : typeof global !== "undefined" ? global.NavigationRouting : null);
var StateRouter = (function () {
    function StateRouter() {
        this.supportsDefaults = true;
    }
    StateRouter.prototype.getData = function (route) {
        var match = this.router.match(route);
        return { state: match.route['_state'], data: this.router.match(route).data };
    };
    StateRouter.prototype.getRoute = function (state, data) {
        var route = state['_route'];
        var routeData = {};
        for (var i = 0; i < route.params.length; i++) {
            routeData[route.params[i].name] = data[route.params[i].name];
        }
        return { route: route.build(data), data: routeData };
    };
    StateRouter.prototype.addRoutes = function (dialogs) {
        this.router = new NavigationRouting.Router();
        var states = [];
        for (var i = 0; i < dialogs.length; i++) {
            for (var j = 0; j < dialogs[i]._states.length; j++) {
                states.push(dialogs[i]._states[j]);
            }
        }
        states.sort(function (stateA, stateB) {
            var stateANumber = stateA.route.substring(0, 1) === '{' ? -1 : 0;
            var stateBNumber = stateB.route.substring(0, 1) === '{' ? -1 : 0;
            return stateBNumber - stateANumber;
        });
        for (var i = 0; i < states.length; i++) {
            var state = states[i];
            state['_route'] = this.router.addRoute(state.route, state.formattedDefaults);
            state['_route']['_state'] = state;
        }
    };
    return StateRouter;
})();
module.exports = StateRouter;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],15:[function(_dereq_,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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

},{"./TypeConverter":16}],16:[function(_dereq_,module,exports){
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

},{}],17:[function(_dereq_,module,exports){
var Dialog = (function () {
    function Dialog() {
        this._states = [];
        this.states = {};
    }
    return Dialog;
})();
module.exports = Dialog;

},{}],18:[function(_dereq_,module,exports){
var StateHandler = _dereq_('../StateHandler');
var State = (function () {
    function State() {
        this._transitions = [];
        this.transitions = {};
        this.defaults = {};
        this.defaultTypes = {};
        this.formattedDefaults = {};
        this.trackCrumbTrail = true;
        this.stateHandler = new StateHandler();
        this.dispose = function () {
        };
        this.navigated = function (data) {
        };
        this.navigating = function (data, url, navigate) {
            navigate();
        };
    }
    return State;
})();
module.exports = State;

},{"../StateHandler":13}],19:[function(_dereq_,module,exports){
var Dialog = _dereq_('./Dialog');
var ReturnDataManager = _dereq_('../ReturnDataManager');
var router = _dereq_('../router');
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
        router.addRoutes(this._dialogs);
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

},{"../ReturnDataManager":10,"../router":24,"./Dialog":17,"./State":18,"./Transition":20}],20:[function(_dereq_,module,exports){
var Transition = (function () {
    function Transition() {
    }
    return Transition;
})();
module.exports = Transition;

},{}],21:[function(_dereq_,module,exports){
var HistoryNavigator = _dereq_('./HistoryNavigator');
var settings = _dereq_('../settings');
var HTML5HistoryManager = (function () {
    function HTML5HistoryManager() {
        this.disabled = (typeof window === 'undefined') || !(window.history && window.history.pushState);
    }
    HTML5HistoryManager.prototype.init = function () {
        if (!this.disabled)
            window.addEventListener('popstate', HistoryNavigator.navigateHistory);
    };
    HTML5HistoryManager.prototype.addHistory = function (state, url) {
        if (state.title && (typeof document !== 'undefined'))
            document.title = state.title;
        url = settings.applicationPath + url;
        if (!this.disabled && location.pathname + location.search !== url)
            window.history.pushState(null, null, url);
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

},{"../settings":25,"./HistoryNavigator":23}],22:[function(_dereq_,module,exports){
var HistoryNavigator = _dereq_('./HistoryNavigator');
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
                window.attachEvent('onhashchange', HistoryNavigator.navigateHistory);
        }
    };
    HashHistoryManager.prototype.addHistory = function (state, url) {
        if (state.title && (typeof document !== 'undefined'))
            document.title = state.title;
        url = this.encode(url);
        if (!this.disabled && location.hash.substring(1) !== url)
            location.hash = url;
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

},{"./HistoryNavigator":23}],23:[function(_dereq_,module,exports){
var HistoryNavigator = (function () {
    function HistoryNavigator() {
    }
    return HistoryNavigator;
})();
module.exports = HistoryNavigator;

},{}],24:[function(_dereq_,module,exports){
var StateRouter = _dereq_('./StateRouter');
var router = new StateRouter();
module.exports = router;

},{"./StateRouter":14}],25:[function(_dereq_,module,exports){
var NavigationSettings = _dereq_('./NavigationSettings');
var settings = new NavigationSettings();
module.exports = settings;

},{"./NavigationSettings":8}]},{},[1])(1)
});
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
            attrs.$set('href', Navigation.historyManager.getHref(linkAccessor()));
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
                    Navigation.StateController.navigateLink(Navigation.historyManager.getUrl(anchor));
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