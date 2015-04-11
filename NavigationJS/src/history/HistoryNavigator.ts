import IHistoryManager = require('./IHistoryManager');

class HistoryNavigator {
    static historyManager: IHistoryManager; 
    static navigateHistory: () => void;
}
export = HistoryNavigator;