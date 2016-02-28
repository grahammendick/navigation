import StateContext = require('./StateContext');
import StateNavigator = require('./StateNavigator');
import State = require('./config/State');
import HashHistoryManager = require('./history/HashHistoryManager');
import HTML5HistoryManager = require('./history/HTML5HistoryManager');
import Crumb = require('./config/Crumb');

class Navigation {
    static State = State;
    static HashHistoryManager = HashHistoryManager;
    static HTML5HistoryManager = HTML5HistoryManager;
    static Crumb = Crumb;
    static StateContext = StateContext;
    static StateNavigator = StateNavigator;
} 
export = Navigation;
