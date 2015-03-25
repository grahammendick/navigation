import HashHistoryManager = require('./HashHistoryManager');
import IHistoryManager = require('./IHistoryManager');
import StateContext = require('../StateContext');
import StateController = require('../StateController');

class HistoryNavigator {
    static historyManager: IHistoryManager = new HashHistoryManager(); 
    static navigateHistory = () => {
        if (StateContext.url === HistoryNavigator.historyManager.getCurrentUrl())
            return;
        StateController.navigateLink(HistoryNavigator.historyManager.getCurrentUrl());
    }
}
export = HistoryNavigator;