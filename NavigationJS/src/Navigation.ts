import HashHistoryManager = require('history/HashHistoryManager');
import historyManager = require('history/historyManager');
import HTML5HistoryManager = require('history/HTML5HistoryManager');
import router = require('router');
import settings = require('settings');
import start = require('start');
import StateContext = require('StateContext');
import StateController = require('StateController');
import StateInfoConfig = require('config/StateInfoConfig');

class Navigation {
    static StateContext = StateContext;
    static StateController = StateController;
    static StateInfoConfig = StateInfoConfig;
    static HashHistoryManager = HashHistoryManager;
    static HTML5HistoryManager = HTML5HistoryManager;
    static historyManager = historyManager;
    static router = router;
    static settings = settings;
    static start = start;
} 
export = Navigation;
