var StateController = require('StateController');
var StateContext = require('StateContext');

var settings = require('settings');
var router = require('router');
var historyManager = require('history/historyManager');

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
        StateController.setStateContext(state, url);
        if (StateContext.url === url)
            historyManager.addHistory(state, url);
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
//# sourceMappingURL=StateHandler.js.map
