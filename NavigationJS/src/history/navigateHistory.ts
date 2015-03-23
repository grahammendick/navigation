import historyManager = require('history/historyManager');
import StateContext = require('StateContext');
import StateController = require('StateController');

var navigateHistory = () => {
    if (StateContext.url === historyManager.getCurrentUrl())
        return;
    StateController.navigateLink(historyManager.getCurrentUrl());
}
export = navigateHistory;
