var historyManager = require('historyManager');
var StateContext = require('StateContext');
var StateController = require('StateController');

var navigateHistory = function () {
    if (StateContext.url === historyManager.getCurrentUrl())
        return;
    StateController.navigateLink(historyManager.getCurrentUrl());
};
module.exports = navigateHistory;
//# sourceMappingURL=navigateHistory.js.map
