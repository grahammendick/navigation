import IHistoryManager = require('./history/IHistoryManager');

interface INavigationSettings {
    historyManager?: IHistoryManager;
}
export = INavigationSettings;