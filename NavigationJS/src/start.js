var historyManager = require('history/historyManager');
var StateController = require('StateController');

function start(url) {
    historyManager.init();
    StateController.navigateLink(url ? url : historyManager.getCurrentUrl());
}
module.exports = start;
//# sourceMappingURL=start.js.map
