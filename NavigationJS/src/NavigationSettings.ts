import IHistoryManager = require('./history/IHistoryManager');
import INavigationSettings = require('./INavigationSettings');
import HashHistoryManager = require('./history/HashHistoryManager');

class NavigationSettings implements INavigationSettings {
    historyManager: IHistoryManager = new HashHistoryManager();
}
export = NavigationSettings;
