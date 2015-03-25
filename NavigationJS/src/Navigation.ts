import StateContext = require('./StateContext');
import StateController = require('./StateController');
import StateInfoConfig = require('./config/StateInfoConfig');
import HistoryNavigator = require('./history/HistoryNavigator');
import HashHistoryManager = require('./history/HashHistoryManager');
import HTML5HistoryManager = require('./history/HTML5HistoryManager');
import router = require('./router');
import settings = require('./settings');

class Navigation {
    static StateInfoConfig = StateInfoConfig;
    static StateContext = StateContext;
    static StateController = StateController;
    static HashHistoryManager = HashHistoryManager;
    static HTML5HistoryManager = HTML5HistoryManager;
    static historyManager = HistoryNavigator.historyManager;
    static router = router;
    static settings = settings;
    static start = (url?: string) => {
        HistoryNavigator.historyManager.init();
        StateController.navigateLink(url ? url : HistoryNavigator.historyManager.getCurrentUrl());
    };
} 
export = Navigation;
