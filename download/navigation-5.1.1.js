/**
 * Navigation v5.1.1
 * (c) Graham Mendick - http://grahammendick.github.io/navigation/
 * License: Apache-2.0
 */
var Navigation = (function (exports) {
    'use strict';

    var StateContext = /** @class */ (function () {
        function StateContext() {
            this.oldState = null;
            this.oldData = {};
            this.oldUrl = null;
            this.previousState = null;
            this.previousData = {};
            this.previousUrl = null;
            this.state = null;
            this.data = {};
            this.url = null;
            this.asyncData = undefined;
            this.title = null;
            this.history = false;
            this.crumbs = [];
            this.nextCrumb = null;
        }
        StateContext.prototype.clear = function () {
            this.oldState = null;
            this.oldData = {};
            this.oldUrl = null;
            this.previousState = null;
            this.previousData = {};
            this.previousUrl = null;
            this.state = null;
            this.data = {};
            this.url = null;
            this.asyncData = undefined;
            this.title = null;
            this.history = false;
            this.crumbs = [];
            this.nextCrumb = null;
        };
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
        return StateContext;
    }());

    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    function __extends$1(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    }

    var Crumb = /** @class */ (function () {
        function Crumb(data, state, url, crumblessUrl, last) {
            this.data = data ? data : {};
            this.state = state;
            this.last = last;
            this.title = state.title;
            this.url = url;
            this.crumblessUrl = crumblessUrl;
        }
        return Crumb;
    }());

    var EventHandlerCache = /** @class */ (function () {
        function EventHandlerCache(name) {
            this.handlerId = 1;
            this.handlers = {};
            this.name = name;
        }
        EventHandlerCache.prototype.onEvent = function (handler) {
            if (!handler[this.name]) {
                var id = this.name + this.handlerId++;
                handler[this.name] = id;
                this.handlers[id] = handler;
            }
            else {
                throw new Error('Cannot add the same handler more than once');
            }
        };
        EventHandlerCache.prototype.offEvent = function (handler) {
            delete this.handlers[handler[this.name]];
            delete handler[this.name];
        };
        return EventHandlerCache;
    }());

    function createFluentNavigator(states, stateHandler, stateContext) {
        if (stateContext === void 0) { stateContext = new StateContext(); }
        function getCrumbTrail(state, navigationData, crumbs, nextCrumb) {
            if (!state.trackCrumbTrail)
                return [];
            crumbs = crumbs.slice();
            if (nextCrumb)
                crumbs.push(nextCrumb);
            return state.truncateCrumbTrail(state, navigationData, crumbs);
        }
        function navigateLink(state, data, crumbs, url) {
            var fluentContext = new StateContext();
            fluentContext.state = state;
            fluentContext.url = url;
            fluentContext.crumbs = crumbs;
            fluentContext.data = data;
            fluentContext.nextCrumb = new Crumb(data, state, url, stateHandler.getLink(state, data), false);
            return createFluentNavigator(states, stateHandler, fluentContext);
        }
        return {
            url: stateContext.url,
            navigate: function (stateKey, navigationData) {
                var state = states[stateKey];
                var crumbs = stateContext.crumbs, nextCrumb = stateContext.nextCrumb;
                if (!state)
                    throw new Error(stateKey + ' is not a valid State');
                if (typeof navigationData === 'function')
                    navigationData = navigationData(stateContext.data);
                var url = stateHandler.getLink(state, navigationData, crumbs, nextCrumb);
                if (url == null)
                    throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
                var data = __assign$1({}, state.defaults, navigationData);
                var crumbs = getCrumbTrail(state, data, crumbs, nextCrumb);
                return navigateLink(state, data, crumbs, url);
            },
            navigateBack: function (distance) {
                var crumbs = stateContext.crumbs;
                if (!(distance <= crumbs.length && distance > 0))
                    throw new Error('The distance parameter must be greater than zero and less than or equal to the number of Crumbs (' + stateContext.crumbs.length + ')');
                var _a = crumbs[crumbs.length - distance], state = _a.state, data = _a.data, url = _a.url;
                var crumbs = crumbs.slice(0, crumbs.length - distance);
                return navigateLink(state, data, crumbs, url);
            },
            refresh: function (navigationData) {
                var state = stateContext.state, crumbs = stateContext.crumbs, nextCrumb = stateContext.nextCrumb;
                if (typeof navigationData === 'function')
                    navigationData = navigationData(stateContext.data);
                var url = stateHandler.getLink(state, navigationData, crumbs, nextCrumb);
                if (url == null)
                    throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
                var data = __assign$1({}, state.defaults, navigationData);
                var crumbs = getCrumbTrail(state, data, crumbs, nextCrumb);
                return navigateLink(state, data, crumbs, url);
            }
        };
    }

    var HashHistoryManager = /** @class */ (function () {
        function HashHistoryManager(replaceQueryIdentifier) {
            if (replaceQueryIdentifier === void 0) { replaceQueryIdentifier = false; }
            this.navigateHistory = null;
            this.replaceQueryIdentifier = false;
            this.disabled = (typeof window === 'undefined') || !('onhashchange' in window);
            this.replaceQueryIdentifier = replaceQueryIdentifier;
        }
        HashHistoryManager.prototype.init = function (navigateHistory) {
            if (!this.disabled && !this.navigateHistory) {
                this.navigateHistory = function () { return navigateHistory(); };
                if (window.addEventListener)
                    window.addEventListener('hashchange', this.navigateHistory);
                else
                    window['attachEvent']('onhashchange', this.navigateHistory);
            }
        };
        HashHistoryManager.prototype.addHistory = function (url, replace) {
            var href = this.getHref(url);
            if (!this.disabled && window.location.hash !== href) {
                if (!replace)
                    window.location.hash = href;
                else
                    window.location.replace(href);
            }
        };
        HashHistoryManager.prototype.getCurrentUrl = function () {
            return this.getUrl(window.location);
        };
        HashHistoryManager.prototype.getHref = function (url) {
            if (url == null)
                throw new Error('The Url is invalid');
            return '#' + this.encode(url);
        };
        HashHistoryManager.prototype.getUrl = function (hrefElement) {
            return this.decode(hrefElement.hash.substring(1));
        };
        HashHistoryManager.prototype.stop = function () {
            if (this.navigateHistory) {
                if (window.removeEventListener)
                    window.removeEventListener('hashchange', this.navigateHistory);
                else
                    window['detachEvent']('onhashchange', this.navigateHistory);
            }
            this.navigateHistory = null;
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
    }());

    var TypeConverter = /** @class */ (function () {
        function TypeConverter(key, name) {
            this.key = key;
            this.name = name;
        }
        TypeConverter.prototype.convertFrom = function (val, separable) {
            if (separable === void 0) { separable = false; }
            return null;
        };
        TypeConverter.prototype.convertTo = function (val) {
            return null;
        };
        return TypeConverter;
    }());

    var ArrayConverter = /** @class */ (function (_super) {
        __extends$1(ArrayConverter, _super);
        function ArrayConverter(converter, key) {
            var _this = _super.call(this, key, converter.name + 'array') || this;
            _this.converter = converter;
            return _this;
        }
        ArrayConverter.prototype.convertFrom = function (val, separable) {
            var arr = [];
            if (typeof val === 'string') {
                if (!separable) {
                    var vals = val.split(ArrayConverter.SEPARATOR);
                    for (var i = 0; i < vals.length; i++) {
                        if (vals[i].length !== 0)
                            arr.push(this.converter.convertFrom(vals[i].replace(/0-/g, '-')));
                        else
                            throw new Error('Empty string is not a valid array item');
                    }
                }
                else {
                    if (val.length !== 0)
                        arr.push(this.converter.convertFrom(val));
                    else
                        throw new Error('Empty string is not a valid array item');
                }
            }
            else {
                for (var i = 0; i < val.length; i++) {
                    if (val[i].length !== 0)
                        arr.push(this.converter.convertFrom(val[i]));
                    else
                        throw new Error('Empty string is not a valid array item');
                }
            }
            return arr;
        };
        ArrayConverter.prototype.convertTo = function (val) {
            var vals = [];
            var arr = [];
            for (var i = 0; i < val.length; i++) {
                if (val[i] != null && val[i].toString()) {
                    var convertedValue = this.converter.convertTo(val[i]).val;
                    arr.push(convertedValue);
                    vals.push(convertedValue.replace(/-/g, '0-'));
                }
                else {
                    throw new Error('Invalid navigation data, arrays cannnot contain null, undefined or empty string');
                }
            }
            return { val: vals.join(ArrayConverter.SEPARATOR), arrayVal: arr };
        };
        ArrayConverter.SEPARATOR = '1-';
        return ArrayConverter;
    }(TypeConverter));

    var BooleanConverter = /** @class */ (function (_super) {
        __extends$1(BooleanConverter, _super);
        function BooleanConverter(key) {
            return _super.call(this, key, 'boolean') || this;
        }
        BooleanConverter.prototype.convertFrom = function (val) {
            if (val !== 'true' && val !== 'false')
                throw new Error(val + ' is not a valid boolean');
            return val === 'true';
        };
        BooleanConverter.prototype.convertTo = function (val) {
            return { val: '' + val };
        };
        return BooleanConverter;
    }(TypeConverter));

    var DateConverter = /** @class */ (function (_super) {
        __extends$1(DateConverter, _super);
        function DateConverter(key) {
            return _super.call(this, key, 'date') || this;
        }
        DateConverter.prototype.convertFrom = function (val) {
            var dateParts = val.split('-');
            if (dateParts.length !== 3)
                throw new Error(val + ' is not a valid date');
            var date = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2]);
            if (isNaN(+date))
                throw new Error(val + ' is not a valid date');
            return date;
        };
        DateConverter.prototype.convertTo = function (val) {
            var year = val.getFullYear();
            var month = ('0' + (val.getMonth() + 1)).slice(-2);
            var day = ('0' + val.getDate()).slice(-2);
            return { val: year + '-' + month + '-' + day };
        };
        return DateConverter;
    }(TypeConverter));

    var NumberConverter = /** @class */ (function (_super) {
        __extends$1(NumberConverter, _super);
        function NumberConverter(key) {
            return _super.call(this, key, 'number') || this;
        }
        NumberConverter.prototype.convertFrom = function (val) {
            if (isNaN(+val))
                throw new Error(val + ' is not a valid number');
            return +val;
        };
        NumberConverter.prototype.convertTo = function (val) {
            return { val: '' + val };
        };
        return NumberConverter;
    }(TypeConverter));

    var StringConverter = /** @class */ (function (_super) {
        __extends$1(StringConverter, _super);
        function StringConverter(key) {
            return _super.call(this, key, 'string') || this;
        }
        StringConverter.prototype.convertFrom = function (val) {
            if (typeof val !== 'string')
                throw new Error(val + ' is not a valid string');
            return val;
        };
        StringConverter.prototype.convertTo = function (val) {
            return { val: '' + val };
        };
        return StringConverter;
    }(TypeConverter));

    var ConverterFactory = /** @class */ (function () {
        function ConverterFactory() {
            this.keyToConverterList = {};
            this.nameToConverterList = {};
            var converterArray = [
                new StringConverter('0'), new BooleanConverter('1'),
                new NumberConverter('2'), new DateConverter('3')
            ];
            for (var i = 0; i < converterArray.length; i++) {
                var converter = converterArray[i];
                var arrayConverter = new ArrayConverter(converter, 'a' + converter.key);
                this.keyToConverterList[converter.key] = this.nameToConverterList[converter.name] = converter;
                this.keyToConverterList[arrayConverter.key] = this.nameToConverterList[arrayConverter.name] = arrayConverter;
            }
        }
        ConverterFactory.prototype.getConverterFromKey = function (key) {
            return this.keyToConverterList[key];
        };
        ConverterFactory.prototype.getConverterFromName = function (name) {
            var converter = this.nameToConverterList[name];
            if (!converter)
                throw new Error('No TypeConverter found for ' + name);
            return converter;
        };
        return ConverterFactory;
    }());

    var NavigationDataManager = /** @class */ (function () {
        function NavigationDataManager() {
            this.converterFactory = new ConverterFactory();
        }
        NavigationDataManager.prototype.formatData = function (state, navigationData, crumbTrail) {
            var data = {};
            var arrayData = {};
            for (var key in navigationData) {
                var val = navigationData[key];
                if (val != null && val.length !== 0)
                    this.formatDataItem(state, key, val, data, arrayData);
            }
            if (state.trackCrumbTrail && crumbTrail.length > 0)
                this.formatDataItem(state, state.crumbTrailKey, crumbTrail, data, arrayData);
            return { data: data, arrayData: arrayData };
        };
        NavigationDataManager.prototype.formatDataItem = function (state, key, val, data, arrayData) {
            var formattedData = this.formatURLObject(key, val, state);
            val = formattedData.val;
            if (val !== state.formattedDefaults[key]) {
                data[key] = val;
                arrayData[key] = formattedData.arrayVal;
            }
        };
        NavigationDataManager.decodeUrlValue = function (urlValue) {
            return urlValue.replace(/0_/g, '_');
        };
        NavigationDataManager.encodeUrlValue = function (urlValue) {
            return urlValue.replace(/_/g, '0_');
        };
        NavigationDataManager.prototype.formatURLObject = function (key, urlObject, state, encode) {
            if (encode === void 0) { encode = false; }
            encode = encode || state.trackTypes;
            var defaultType = state.defaultTypes[key] || 'string';
            var converter = this.getConverter(urlObject);
            var convertedValue = converter.convertTo(urlObject);
            var formattedValue = convertedValue.val;
            var formattedArray = convertedValue.arrayVal;
            if (encode) {
                formattedValue = NavigationDataManager.encodeUrlValue(formattedValue);
                if (formattedArray)
                    formattedArray[0] = NavigationDataManager.encodeUrlValue(formattedArray[0]);
            }
            if (state.trackTypes && converter.name !== defaultType) {
                formattedValue += NavigationDataManager.SEPARATOR + converter.key;
                if (formattedArray)
                    formattedArray[0] = formattedArray[0] + NavigationDataManager.SEPARATOR + converter.key;
            }
            return { val: formattedValue, arrayVal: formattedArray };
        };
        NavigationDataManager.prototype.parseData = function (data, state, separableData) {
            var newData = {};
            for (var key in data) {
                if (!NavigationDataManager.isDefault(key, data, state, !!separableData[key]))
                    newData[key] = this.parseURLString(key, data[key], state, false, !!separableData[key]);
            }
            for (var key in state.defaults) {
                if (newData[key] == null || !newData[key].toString())
                    newData[key] = state.defaults[key];
            }
            return newData;
        };
        NavigationDataManager.isDefault = function (key, data, state, separable) {
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
        NavigationDataManager.prototype.parseURLString = function (key, val, state, decode, separable) {
            if (decode === void 0) { decode = false; }
            if (separable === void 0) { separable = false; }
            decode = decode || state.trackTypes;
            var defaultType = state.defaultTypes[key] || 'string';
            var urlValue = typeof val === 'string' ? val : val[0];
            var converterKey = this.converterFactory.getConverterFromName(defaultType).key;
            if (state.trackTypes && urlValue.indexOf(NavigationDataManager.SEPARATOR) > -1) {
                var arr = urlValue.split(NavigationDataManager.SEPARATOR);
                urlValue = arr[0];
                converterKey = arr[1];
            }
            if (decode)
                urlValue = NavigationDataManager.decodeUrlValue(urlValue);
            if (typeof val === 'string')
                val = urlValue;
            else
                val[0] = urlValue;
            return this.converterFactory.getConverterFromKey(converterKey).convertFrom(val, separable);
        };
        NavigationDataManager.prototype.getConverter = function (obj) {
            var fullName = NavigationDataManager.getTypeName(obj);
            if (fullName === 'array') {
                var arr = obj;
                var subName = 'string';
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != null && arr[i].toString()) {
                        subName = NavigationDataManager.getTypeName(arr[i]);
                        break;
                    }
                }
                fullName = subName + fullName;
            }
            return this.converterFactory.getConverterFromName(fullName);
        };
        NavigationDataManager.getTypeName = function (obj) {
            var typeName = typeof obj;
            if (typeName === 'object') {
                typeName = Object.prototype.toString.call(obj);
                typeName = typeName.substring(8, typeName.length - 1).toLowerCase();
            }
            return typeName;
        };
        NavigationDataManager.SEPARATOR = '1_';
        return NavigationDataManager;
    }());

    var State = /** @class */ (function () {
        function State() {
            this.defaults = {};
            this.defaultTypes = {};
            this.formattedDefaults = {};
            this.formattedArrayDefaults = {};
            this.trackCrumbTrail = false;
            this.trackTypes = true;
        }
        State.prototype.unloading = function (state, data, url, unload, history) {
            unload();
        };
        State.prototype.navigating = function (data, url, navigate, history) {
            navigate();
        };
        State.prototype.dispose = function () {
        };
        State.prototype.navigated = function (data, asyncData) {
        };
        State.prototype.urlEncode = function (state, key, val, queryString, index) {
            return encodeURIComponent(val);
        };
        State.prototype.urlDecode = function (state, key, val, queryString) {
            return decodeURIComponent(val);
        };
        State.prototype.validate = function (data) {
            return true;
        };
        State.prototype.truncateCrumbTrail = function (state, data, crumbs) {
            return crumbs;
        };
        return State;
    }());

    var Segment = /** @class */ (function () {
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
                if (subSegment.slice(0, 1) === '{') {
                    var param = subSegment.substring(1, subSegment.length - 1);
                    var optional = param.slice(-1) === '?';
                    var splat = param.slice(0, 1) === '*';
                    var name = optional ? param.slice(0, -1) : param;
                    name = splat ? name.slice(1) : name;
                    this.params.push({ name: name, splat: splat });
                    this.optional = this.optional && optional && this.path.length === subSegment.length;
                    if (this.path.length === subSegment.length)
                        optional = this.optional;
                    this.subSegments.push({ name: name, param: true, splat: splat, optional: optional });
                    var subPattern = !splat ? '[^/]+' : '.+';
                    this.pattern += !this.optional ? "(" + subPattern + ")" : "(/" + subPattern + ")";
                    this.pattern += optional ? '?' : '';
                }
                else {
                    this.optional = false;
                    this.subSegments.push({ name: subSegment, param: false, splat: false, optional: false });
                    this.pattern += subSegment.replace(this.escapePattern, '\\$&');
                }
            }
            if (!this.optional)
                this.pattern = '\/' + this.pattern;
        };
        Segment.prototype.build = function (data, defaults, urlEncode) {
            var routePath = '';
            var blank = false;
            var optional = false;
            for (var i = 0; i < this.subSegments.length; i++) {
                var subSegment = this.subSegments[i];
                if (!subSegment.param) {
                    routePath += subSegment.name;
                }
                else {
                    var val = data[subSegment.name];
                    var defaultVal = defaults[subSegment.name];
                    optional = subSegment.optional && (!val || val === defaultVal);
                    if (this.optional || !optional) {
                        val = val || defaultVal;
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
                            }
                        }
                    }
                }
            }
            return { path: !blank ? routePath : null, optional: optional && this.optional };
        };
        return Segment;
    }());

    var Route = /** @class */ (function () {
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
            data = data || {};
            var route = '';
            var optional = true;
            var blank = false;
            for (var i = this.segments.length - 1; i >= 0; i--) {
                var segment = this.segments[i];
                var pathInfo = segment.build(data, this.defaults, function (name, val) {
                    var encodedValue = urlEncode(_this, name, val);
                    blank = blank || !encodedValue;
                    return encodedValue;
                });
                if (blank)
                    return null;
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
    }());

    var Router = /** @class */ (function () {
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
        Router.prototype.match = function (path, fromRoute, urlDecode) {
            path = path.slice(-1) === '/' ? path.substring(0, path.length - 1) : path;
            path = (path.substring(0, 1) === '/' || path.length === 0) ? path : '/' + path;
            var startMatching = !fromRoute;
            for (var i = 0; i < this.routes.length; i++) {
                var route = this.routes[i];
                if (startMatching) {
                    var data = route.match(path, urlDecode);
                    if (data)
                        return { route: route, data: data };
                }
                else {
                    startMatching = route === fromRoute;
                }
            }
            return null;
        };
        Router.prototype.sort = function (compare) {
            this.routes.sort(compare);
        };
        return Router;
    }());

    var StateRouter = /** @class */ (function () {
        function StateRouter() {
        }
        StateRouter.prototype.getData = function (path, fromRoute) {
            var match = this.router.match(path, fromRoute, StateRouter.urlDecode);
            if (!match)
                return null;
            var separableData = {};
            var route = match.route, _a = match.route, splat = _a._splat, state = _a._state, params = _a.params, data = match.data;
            if (splat) {
                for (var i = 0; i < params.length; i++) {
                    var param = params[i];
                    if (param.splat)
                        separableData[param.name] = true;
                }
            }
            return { state: state, data: data, separableData: separableData, route: route };
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
            var bestMatchParamCount = -1;
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
                    if (count > bestMatchCount || (count === bestMatchCount && route.params.length < bestMatchParamCount)) {
                        bestMatch = { route: route, data: routeData, routePath: routePath };
                        bestMatchCount = count;
                        bestMatchParamCount = route.params.length;
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
            return state.urlEncode(state, name, val, false);
        };
        StateRouter.urlDecode = function (route, name, val) {
            var state = route['_state'];
            return state.urlDecode(state, name, val, false);
        };
        StateRouter.prototype.addRoutes = function (states) {
            this.router = new Router();
            for (var i = 0; i < states.length; i++) {
                this.addStateRoutes(states[i]);
            }
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
                routes = routes.concat(StateRouter.expandRoute(route));
            }
            else {
                for (var i = 0; i < route.length; i++) {
                    routes = routes.concat(StateRouter.expandRoute(route[i]));
                }
            }
            return routes;
        };
        StateRouter.expandRoute = function (route) {
            var routes = [];
            var subRoutes = route.split('+');
            var expandedRoute = '';
            for (var i = 0; i < subRoutes.length; i++) {
                expandedRoute += subRoutes[i];
                routes.push(expandedRoute);
            }
            return routes;
        };
        return StateRouter;
    }());

    var StateHandler = /** @class */ (function () {
        function StateHandler() {
            this.navigationDataManager = new NavigationDataManager();
            this.router = new StateRouter();
        }
        StateHandler.prototype.buildStates = function (states) {
            var builtStates = [];
            var stateKeys = {};
            for (var i = 0; i < states.length; i++) {
                var stateObject = states[i];
                var state = new State();
                for (var key in stateObject)
                    state[key] = stateObject[key];
                if (!state.key)
                    throw new Error('State key is mandatory');
                if (state.route == null)
                    state.route = state.key;
                if (state.trackCrumbTrail) {
                    state.trackCrumbTrail = true;
                    state.crumbTrailKey = 'crumb';
                    var trackCrumbTrail = stateObject.trackCrumbTrail;
                    if (typeof trackCrumbTrail === 'string')
                        state.crumbTrailKey = trackCrumbTrail;
                    state.defaultTypes[state.crumbTrailKey] = 'stringarray';
                }
                for (var key in state.defaults) {
                    if (!state.defaultTypes[key])
                        state.defaultTypes[key] = this.navigationDataManager.getConverter(state.defaults[key]).name;
                    var formattedData = this.navigationDataManager.formatURLObject(key, state.defaults[key], state);
                    state.formattedDefaults[key] = formattedData.val;
                    if (formattedData.arrayVal)
                        state.formattedArrayDefaults[key] = formattedData.arrayVal;
                }
                if (stateKeys[state.key])
                    throw new Error('A State with key ' + state.key + ' already exists');
                stateKeys[state.key] = true;
                builtStates.push(state);
            }
            this.router.addRoutes(builtStates);
            return builtStates;
        };
        StateHandler.prototype.getLink = function (state, navigationData, crumbs, nextCrumb) {
            var crumbTrail = [];
            if (crumbs) {
                crumbs = crumbs.slice();
                if (nextCrumb)
                    crumbs.push(nextCrumb);
                crumbs = state.truncateCrumbTrail(state, __assign$1({}, state.defaults, navigationData), crumbs);
                for (var i = 0; i < crumbs.length; i++)
                    crumbTrail.push(crumbs[i].crumblessUrl);
            }
            return this.getNavigationLink(state, navigationData, crumbTrail);
        };
        StateHandler.prototype.getNavigationLink = function (state, navigationData, crumbTrail) {
            var _a = this.navigationDataManager.formatData(state, navigationData, crumbTrail), data = _a.data, arrayData = _a.arrayData;
            var routeInfo = this.router.getRoute(state, data, arrayData);
            if (routeInfo.route == null)
                return null;
            var query = [];
            for (var key in data) {
                if (!routeInfo.data[key]) {
                    var arr = arrayData[key];
                    if (!arr) {
                        var encodedKey = state.urlEncode(state, null, key, true);
                        var encodedValue = state.urlEncode(state, key, data[key], true);
                        query.push(encodedKey + (encodedValue ? '=' + encodedValue : ''));
                    }
                    else {
                        for (var i = 0; i < arr.length; i++) {
                            var encodedKey = state.urlEncode(state, null, key, true, i);
                            var encodedValue = state.urlEncode(state, key, arr[i], true);
                            query.push(encodedKey + (encodedValue ? '=' + encodedValue : ''));
                        }
                    }
                }
            }
            if (query.length > 0)
                routeInfo.route += '?' + query.join('&');
            return routeInfo.route;
        };
        StateHandler.prototype.parseLink = function (url, fromRoute, err) {
            if (err === void 0) { err = ''; }
            var queryIndex = url.indexOf('?');
            var path = queryIndex < 0 ? url : url.substring(0, queryIndex);
            var query = queryIndex >= 0 ? url.substring(queryIndex + 1) : null;
            var match = this.router.getData(path, fromRoute);
            if (!match)
                throw new Error('The Url ' + url + ' is invalid' + (err || '\nNo match found'));
            var state = match.state, data = match.data, separableData = match.separableData, route = match.route;
            try {
                var navigationData = this.getNavigationData(query, state, data || {}, separableData);
            }
            catch (e) {
                err += '\n' + e.message;
            }
            return navigationData || this.parseLink(url, route, err);
        };
        StateHandler.prototype.getNavigationData = function (query, state, data, separableData) {
            if (query) {
                var params = query.split('&');
                for (var i = 0; i < params.length; i++) {
                    var param = params[i].split('=');
                    var key = state.urlDecode(state, null, param[0], true);
                    var val = state.urlDecode(state, key, param[1] || '', true);
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
            data = this.navigationDataManager.parseData(data, state, separableData);
            var crumbTrail = data[state.crumbTrailKey];
            delete data[state.crumbTrailKey];
            var valid = state.validate(data);
            if (valid) {
                data[state.crumbTrailKey] = this.getCrumbs(crumbTrail);
                return { state: state, data: data };
            }
            return null;
        };
        StateHandler.prototype.getCrumbs = function (crumbTrail) {
            var crumbs = [];
            var len = crumbTrail ? crumbTrail.length : 0;
            for (var i = 0; i < len; i++) {
                var crumblessUrl = crumbTrail[i];
                if (crumblessUrl.substring(0, 1) !== '/')
                    crumblessUrl = '/' + crumblessUrl;
                var _a = this.parseLink(crumblessUrl), state = _a.state, data = _a.data;
                delete data[state.crumbTrailKey];
                var url = this.getNavigationLink(state, data, crumbTrail.slice(0, i));
                crumbs.push(new Crumb(data, state, url, crumblessUrl, i + 1 === len));
            }
            return crumbs;
        };
        return StateHandler;
    }());

    var StateNavigator = /** @class */ (function () {
        function StateNavigator(stateInfos, historyManager) {
            var _this = this;
            this.stateHandler = new StateHandler();
            this.onBeforeNavigateCache = new EventHandlerCache('beforeNavigateHandler');
            this.onNavigateCache = new EventHandlerCache('navigateHandler');
            this.stateContext = new StateContext();
            this.states = {};
            this.onBeforeNavigate = function (handler) { return _this.onBeforeNavigateCache.onEvent(handler); };
            this.offBeforeNavigate = function (handler) { return _this.onBeforeNavigateCache.offEvent(handler); };
            this.onNavigate = function (handler) { return _this.onNavigateCache.onEvent(handler); };
            this.offNavigate = function (handler) { return _this.onNavigateCache.offEvent(handler); };
            if (stateInfos)
                this.configure(stateInfos, historyManager);
        }
        StateNavigator.prototype.configure = function (stateInfos, historyManager) {
            var _this = this;
            if (this.historyManager)
                this.historyManager.stop();
            this.historyManager = historyManager ? historyManager : new HashHistoryManager();
            this.historyManager.init(function (url) {
                if (url === void 0) { url = _this.historyManager.getCurrentUrl(); }
                _this.navigateLink(url, undefined, true);
            });
            if (this.isStateInfos(stateInfos)) {
                var states = this.stateHandler.buildStates(stateInfos);
                this.states = {};
                for (var i = 0; i < states.length; i++)
                    this.states[states[i].key] = states[i];
            }
            else {
                this.stateHandler = stateInfos.stateHandler;
                this.states = stateInfos.states;
            }
        };
        StateNavigator.prototype.isStateInfos = function (stateInfos) {
            return !stateInfos.stateHandler;
        };
        StateNavigator.prototype.createStateContext = function (state, data, crumbs, url, asyncData, history) {
            var stateContext = new StateContext();
            stateContext.oldState = this.stateContext.state;
            stateContext.oldData = this.stateContext.data;
            stateContext.oldUrl = this.stateContext.url;
            stateContext.state = state;
            stateContext.url = url;
            stateContext.asyncData = asyncData;
            stateContext.title = state.title;
            stateContext.history = history;
            stateContext.crumbs = crumbs;
            stateContext.data = data;
            stateContext.nextCrumb = new Crumb(data, state, url, this.stateHandler.getLink(state, data), false);
            stateContext.previousState = null;
            stateContext.previousData = {};
            stateContext.previousUrl = null;
            if (stateContext.crumbs.length > 0) {
                var previousStateCrumb = stateContext.crumbs.slice(-1)[0];
                stateContext.previousState = previousStateCrumb.state;
                stateContext.previousData = previousStateCrumb.data;
                stateContext.previousUrl = previousStateCrumb.url;
            }
            return stateContext;
        };
        StateNavigator.prototype.navigate = function (stateKey, navigationData, historyAction) {
            var url = this.getNavigationLink(stateKey, navigationData);
            if (url == null)
                throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
            this.navigateLink(url, historyAction);
        };
        StateNavigator.prototype.getNavigationLink = function (stateKey, navigationData) {
            if (!this.states[stateKey])
                throw new Error(stateKey + ' is not a valid State');
            var _a = this.stateContext, crumbs = _a.crumbs, nextCrumb = _a.nextCrumb;
            return this.stateHandler.getLink(this.states[stateKey], navigationData, crumbs, nextCrumb);
        };
        StateNavigator.prototype.canNavigateBack = function (distance) {
            return distance <= this.stateContext.crumbs.length && distance > 0;
        };
        StateNavigator.prototype.navigateBack = function (distance, historyAction) {
            var url = this.getNavigationBackLink(distance);
            this.navigateLink(url, historyAction);
        };
        StateNavigator.prototype.getNavigationBackLink = function (distance) {
            if (!this.canNavigateBack(distance))
                throw new Error('The distance parameter must be greater than zero and less than or equal to the number of Crumbs (' + this.stateContext.crumbs.length + ')');
            return this.stateContext.crumbs[this.stateContext.crumbs.length - distance].url;
        };
        StateNavigator.prototype.refresh = function (navigationData, historyAction) {
            var url = this.getRefreshLink(navigationData);
            if (url == null)
                throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
            this.navigateLink(url, historyAction);
        };
        StateNavigator.prototype.getRefreshLink = function (navigationData) {
            var _a = this.stateContext, crumbs = _a.crumbs, nextCrumb = _a.nextCrumb;
            return this.stateHandler.getLink(this.stateContext.state, navigationData, crumbs, nextCrumb);
        };
        StateNavigator.prototype.navigateLink = function (url, historyAction, history, suspendNavigation) {
            var _this = this;
            if (historyAction === void 0) { historyAction = 'add'; }
            if (history === void 0) { history = false; }
            if (suspendNavigation === void 0) { suspendNavigation = function (_, resumeNavigation) { return resumeNavigation(); }; }
            if (history && this.stateContext.url === url)
                return;
            var oldUrl = this.stateContext.url;
            var _a = this.parseLink(url), state = _a.state, data = _a.data, crumbs = _a.crumbs;
            for (var id in this.onBeforeNavigateCache.handlers) {
                var handler = this.onBeforeNavigateCache.handlers[id];
                if (oldUrl !== this.stateContext.url || !handler(state, data, url, history, this.stateContext))
                    return;
            }
            var navigateContinuation = function (asyncData) {
                var stateContext = _this.createStateContext(state, data, crumbs, url, asyncData, history);
                if (oldUrl === _this.stateContext.url) {
                    suspendNavigation(stateContext, function () {
                        if (oldUrl === _this.stateContext.url)
                            _this.resumeNavigation(stateContext, historyAction);
                    });
                }
            };
            var unloadContinuation = function () {
                if (oldUrl === _this.stateContext.url)
                    state.navigating(data, url, navigateContinuation, history);
            };
            if (this.stateContext.state)
                this.stateContext.state.unloading(state, data, url, unloadContinuation, history);
            else
                state.navigating(data, url, navigateContinuation, history);
        };
        StateNavigator.prototype.resumeNavigation = function (stateContext, historyAction) {
            this.stateContext = stateContext;
            var oldState = stateContext.oldState, state = stateContext.state, data = stateContext.data, asyncData = stateContext.asyncData, url = stateContext.url;
            if (this.stateContext.oldState && this.stateContext.oldState !== state)
                this.stateContext.oldState.dispose();
            state.navigated(this.stateContext.data, asyncData);
            for (var id in this.onNavigateCache.handlers) {
                if (url === this.stateContext.url)
                    this.onNavigateCache.handlers[id](oldState, state, data, asyncData, stateContext);
            }
            if (url === this.stateContext.url) {
                if (historyAction !== 'none')
                    this.historyManager.addHistory(url, historyAction === 'replace');
                if (this.stateContext.title && (typeof document !== 'undefined'))
                    document.title = this.stateContext.title;
            }
        };
        StateNavigator.prototype.parseLink = function (url) {
            var _a = this.stateHandler.parseLink(url), state = _a.state, data = _a.data;
            var _b = data, _c = state.crumbTrailKey, crumbs = _b[_c], data = __rest(_b, [typeof _c === "symbol" ? _c : _c + ""]);
            return { state: state, data: data, crumbs: crumbs };
        };
        StateNavigator.prototype.fluent = function (withContext) {
            if (withContext === void 0) { withContext = false; }
            var stateContext = !withContext ? undefined : this.stateContext;
            return createFluentNavigator(this.states, this.stateHandler, stateContext);
        };
        StateNavigator.prototype.start = function (url) {
            this.navigateLink(url != null ? url : this.historyManager.getCurrentUrl());
        };
        return StateNavigator;
    }());

    var HTML5HistoryManager = /** @class */ (function () {
        function HTML5HistoryManager(applicationPath) {
            if (applicationPath === void 0) { applicationPath = ''; }
            this.navigateHistory = null;
            this.applicationPath = '';
            this.disabled = (typeof window === 'undefined') || !(window.history && window.history.pushState);
            this.applicationPath = HTML5HistoryManager.prependSlash(applicationPath);
        }
        HTML5HistoryManager.prototype.init = function (navigateHistory) {
            if (!this.disabled && !this.navigateHistory) {
                this.navigateHistory = function (e) { return navigateHistory(e.state || undefined); };
                window.addEventListener('popstate', this.navigateHistory);
            }
        };
        HTML5HistoryManager.prototype.addHistory = function (url, replace) {
            var href = this.getHref(url);
            if (!this.disabled && this.getHref(this.getUrl(window.location)) !== href) {
                if (!replace)
                    window.history.pushState(url, null, href);
                else
                    window.history.replaceState(url, null, href);
            }
        };
        HTML5HistoryManager.prototype.getCurrentUrl = function () {
            return this.getUrl(window.location);
        };
        HTML5HistoryManager.prototype.getHref = function (url) {
            if (url == null)
                throw new Error('The Url is invalid');
            return this.applicationPath + HTML5HistoryManager.prependSlash(url);
        };
        HTML5HistoryManager.prototype.getUrl = function (hrefElement) {
            return hrefElement.pathname.substring(this.applicationPath.length) + hrefElement.search;
        };
        HTML5HistoryManager.prototype.stop = function () {
            if (this.navigateHistory)
                window.removeEventListener('popstate', this.navigateHistory);
            this.navigateHistory = null;
        };
        HTML5HistoryManager.prependSlash = function (url) {
            return (url && url.substring(0, 1) !== '/') ? '/' + url : url;
        };
        return HTML5HistoryManager;
    }());

    exports.State = State;
    exports.HashHistoryManager = HashHistoryManager;
    exports.HTML5HistoryManager = HTML5HistoryManager;
    exports.Crumb = Crumb;
    exports.StateContext = StateContext;
    exports.StateNavigator = StateNavigator;

    return exports;

}({}));
