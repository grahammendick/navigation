import StateContext = require('./StateContext');
import StateController = require('./StateController');
import Dialog = require('./config/Dialog');
import State = require('./config/State');
import Transition = require('./config/Transition');
import StateInfoConfig = require('./config/StateInfoConfig');
import HistoryNavigator = require('./history/HistoryNavigator');
import HashHistoryManager = require('./history/HashHistoryManager');
import HTML5HistoryManager = require('./history/HTML5HistoryManager');
import Crumb = require('./Crumb');
import StateHandler = require('./StateHandler');
import StateRouter = require('./StateRouter');
import NavigationSettings = require('./NavigationSettings');
import router = require('./router');
import settings = require('./settings');

class Navigation {
    static Dialog = Dialog;
    static State = State;
    static Transition = Transition;
    static StateInfoConfig = StateInfoConfig;
    static HashHistoryManager = HashHistoryManager;
    static HTML5HistoryManager = HTML5HistoryManager;
    static historyManager = HistoryNavigator.historyManager = new HashHistoryManager();
    static Crumb = Crumb;
    static NavigationSettings = NavigationSettings;
    static StateContext = StateContext;
    static StateController = StateController;
    static StateHandler = StateHandler;
    static StateRouter = StateRouter;
    static router = router;
    static settings = settings;
    static start = (url?: string) => {
        HistoryNavigator.historyManager.init();
        StateController.navigateLink(url ? url : HistoryNavigator.historyManager.getCurrentUrl());
    };
} 
HistoryNavigator.navigateHistory = () => {
    if (StateContext.url === HistoryNavigator.historyManager.getCurrentUrl())
        return;
    StateController.navigateLink(HistoryNavigator.historyManager.getCurrentUrl());
}
export = Navigation;
