var historyManager = require('history/historyManager');
var router = require('router');
var settings = require('settings');
var start = require('start');
var StateContext = require('StateContext');
var StateController = require('StateController');
var StateInfoConfig = require('config/StateInfoConfig');

var Navigation = (function () {
    function Navigation() {
    }
    Navigation.StateContext = StateContext;
    Navigation.StateController = StateController;
    Navigation.StateInfoConfig = StateInfoConfig;
    Navigation.historyManager = historyManager;
    Navigation.router = router;
    Navigation.settings = settings;
    Navigation.start = start;
    return Navigation;
})();
module.exports = Navigation;
//# sourceMappingURL=Navigation.js.map
