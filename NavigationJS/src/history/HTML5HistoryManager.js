var navigateHistory = require('history/navigateHistory');

var settings = require('settings');

var HTML5HistoryManager = (function () {
    function HTML5HistoryManager() {
        this.disabled = (typeof window === 'undefined') || !(window.history && window.history.pushState);
    }
    HTML5HistoryManager.prototype.init = function () {
        if (!this.disabled) {
            window.removeEventListener('popstate', navigateHistory);
            window.addEventListener('popstate', navigateHistory);
        }
    };

    HTML5HistoryManager.prototype.addHistory = function (state, url) {
        if (state.title && (typeof document !== 'undefined'))
            document.title = state.title;
        url = settings.applicationPath + url;
        if (!this.disabled && location.pathname + location.search !== url)
            window.history.pushState(null, null, url);
    };

    HTML5HistoryManager.prototype.getCurrentUrl = function () {
        return location.pathname.substring(settings.applicationPath.length) + location.search;
    };

    HTML5HistoryManager.prototype.getHref = function (url) {
        if (!url)
            throw new Error('The Url is invalid');
        return settings.applicationPath + url;
    };

    HTML5HistoryManager.prototype.getUrl = function (anchor) {
        return anchor.pathname.substring(settings.applicationPath.length) + anchor.search;
    };
    return HTML5HistoryManager;
})();
module.exports = HTML5HistoryManager;
//# sourceMappingURL=HTML5HistoryManager.js.map
