import HistoryNavigator = require('./history/HistoryNavigator');
import StateController = require('./StateController');

function start(url?: string) {
    HistoryNavigator.historyManager.init();
    StateController.navigateLink(url ? url : HistoryNavigator.historyManager.getCurrentUrl());
}
export = start;

 