import StateContext = require('./StateContext');
import StateController = require('./StateController');
import StateInfoConfig = require('./config/StateInfoConfig');
import historyManager = require('./history/historyManager');
import HashHistoryManager = require('./history/HashHistoryManager');
import HTML5HistoryManager = require('./history/HTML5HistoryManager');
import router = require('./router');
import settings = require('./settings');
import start = require('./start');

class Navigation {
    static StateInfoConfig = StateInfoConfig;
    static StateContext = StateContext;
    static StateController = StateController;
    static HashHistoryManager = HashHistoryManager;
    static HTML5HistoryManager = HTML5HistoryManager;
    static historyManager = historyManager;
    static router = router;
    static settings = settings;
    static start = start;
} 
export = Navigation;
