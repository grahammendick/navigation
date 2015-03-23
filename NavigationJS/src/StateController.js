var StateContext = require('StateContext');

var CrumbTrailManager = require('CrumbTrailManager');
var settings = require('settings');
var router = require('router');
var NavigationData = require('NavigationData');
var StateInfoConfig = require('config/StateInfoConfig');

var StateController = (function () {
    function StateController() {
    }
    StateController.setStateContext = function (state, url) {
        var oldState = StateContext.state;
        try  {
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
                CrumbTrailManager.returnData = CrumbTrailManager.parseReturnData(data[settings.returnDataKey], StateContext.previousState);
            CrumbTrailManager.crumbTrail = data[settings.crumbTrailKey];
            StateContext.data = this.parseData(data, state);
            CrumbTrailManager.buildCrumbTrail();
            this.crumbs = CrumbTrailManager.getCrumbs(true);
        } catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
        if (oldState && oldState !== state)
            oldState.dispose();
        state.navigated(StateContext.data);
        for (var id in this.navigateHandlers) {
            if (url === StateContext.url)
                this.navigateHandlers[id](oldState, state, StateContext.data);
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
        try  {
            var state = router.getData(url.split('?')[0]).state;
        } catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
        this._navigateLink(url, state);
    };

    StateController._navigateLink = function (url, state) {
        try  {
            var oldUrl = StateContext.url;
            var oldState = StateContext.state;
            var data = state.stateHandler.getNavigationData(state, url);
            data = this.parseData(data, state);
        } catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
        state.navigating(data, url, function () {
            if (oldUrl === StateContext.url)
                state.stateHandler.navigateLink(oldState, state, url);
        });
    };

    StateController.parseData = function (data, state) {
        var newData = {};
        for (var key in data) {
            if (key !== settings.previousStateIdKey && key !== settings.returnDataKey && key !== settings.crumbTrailKey)
                newData[key] = CrumbTrailManager.parseURLString(key, data[key], state);
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
//# sourceMappingURL=StateController.js.map
