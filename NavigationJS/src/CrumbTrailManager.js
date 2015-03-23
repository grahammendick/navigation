var StateContext = require('StateContext');
var Crumb = require('Crumb');

var NavigationData = require('NavigationData');
var ConverterFactory = require('ConverterFactory');
var StateInfoConfig = require('config/StateInfoConfig');
var settings = require('settings');
var router = require('router');

var CrumbTrailManager = (function () {
    function CrumbTrailManager() {
    }
    CrumbTrailManager.buildCrumbTrail = function () {
        var crumbs = this.getCrumbs(false);
        if (StateContext.previousState)
            crumbs.push(new Crumb(this.returnData, StateContext.previousState, false));
        crumbs = StateContext.state.stateHandler.truncateCrumbTrail(StateContext.state, crumbs);
        crumbs.reverse();
        var trailString = '';
        for (var i = 0; i < crumbs.length; i++) {
            trailString += this.CRUMB_1_SEP + crumbs[i].state.id + this.CRUMB_2_SEP;
            trailString += this.formatReturnData(crumbs[i].state, crumbs[i].data);
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
                navigationData = this.parseReturnData(data, state);
            var nextTrailStart = trail.indexOf(this.CRUMB_1_SEP, 1);
            trail = nextTrailStart != -1 ? trail.substring(nextTrailStart) : '';
            crumbTrailArray.push(new Crumb(navigationData, state, setLast && last));
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
                data[key] = this.formatURLObject(key, navigationData[key], state);
        }
        if (state.trackCrumbTrail && StateContext.state) {
            var returnDataString = this.formatReturnData(StateContext.state, returnData);
            if (returnDataString)
                data[settings.returnDataKey] = returnDataString;
        }
        if (this.crumbTrail && state.trackCrumbTrail)
            data[settings.crumbTrailKey] = this.crumbTrail;
        return state.stateHandler.getNavigationLink(state, data);
    };

    CrumbTrailManager.formatReturnData = function (state, returnData) {
        var returnDataArray = [];
        for (var key in returnData) {
            if (returnData[key] != null && returnData[key].toString() && (!router.supportsDefaults || returnData[key] !== state.defaults[key]))
                returnDataArray.push(this.encodeUrlValue(key) + this.RET_1_SEP + this.formatURLObject(key, returnData[key], state));
        }
        return returnDataArray.join(this.RET_3_SEP);
    };

    CrumbTrailManager.decodeUrlValue = function (urlValue) {
        return urlValue.replace(new RegExp('0' + this.SEPARATOR, 'g'), this.SEPARATOR);
    };

    CrumbTrailManager.encodeUrlValue = function (urlValue) {
        return urlValue.replace(new RegExp(this.SEPARATOR, 'g'), '0' + this.SEPARATOR);
    };

    CrumbTrailManager.formatURLObject = function (key, urlObject, state) {
        var defaultType = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
        var converterKey = ConverterFactory.getKeyFromObject(urlObject);
        var formattedValue = ConverterFactory.getConverter(converterKey).convertTo(urlObject);
        formattedValue = this.encodeUrlValue(formattedValue);
        if (typeof urlObject !== defaultType)
            formattedValue += this.RET_2_SEP + converterKey;
        return formattedValue;
    };

    CrumbTrailManager.parseURLString = function (key, val, state) {
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

    CrumbTrailManager.getRefreshHref = function (refreshData) {
        return this.getHref(StateContext.state, refreshData, null);
    };

    CrumbTrailManager.parseReturnData = function (returnData, state) {
        var navigationData = {};
        var returnDataArray = returnData.split(this.RET_3_SEP);
        for (var i = 0; i < returnDataArray.length; i++) {
            var nameValuePair = returnDataArray[i].split(this.RET_1_SEP);
            navigationData[this.decodeUrlValue(nameValuePair[0])] = this.parseURLString(this.decodeUrlValue(nameValuePair[0]), nameValuePair[1], state);
        }
        return navigationData;
    };
    CrumbTrailManager.SEPARATOR = '_';
    CrumbTrailManager.RET_1_SEP = '1_';
    CrumbTrailManager.RET_2_SEP = '2_';
    CrumbTrailManager.RET_3_SEP = '3_';
    CrumbTrailManager.CRUMB_1_SEP = '4_';
    CrumbTrailManager.CRUMB_2_SEP = '5_';
    return CrumbTrailManager;
})();
module.exports = CrumbTrailManager;
//# sourceMappingURL=CrumbTrailManager.js.map
