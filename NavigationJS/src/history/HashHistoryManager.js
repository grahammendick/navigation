var navigateHistory = require('history/navigateHistory');

var HashHistoryManager = (function () {
    function HashHistoryManager() {
        this.disabled = (typeof window === 'undefined') || !('onhashchange' in window);
    }
    HashHistoryManager.prototype.init = function () {
        if (!this.disabled) {
            if (window.addEventListener) {
                window.removeEventListener('hashchange', navigateHistory);
                window.addEventListener('hashchange', navigateHistory);
            } else {
                window.detachEvent('onhashchange', navigateHistory);
                window.attachEvent('onhashchange', navigateHistory);
            }
        }
    };

    HashHistoryManager.prototype.addHistory = function (state, url) {
        if (state.title && (typeof document !== 'undefined'))
            document.title = state.title;
        if (!this.disabled && location.hash.substring(1) !== url)
            location.hash = url;
    };

    HashHistoryManager.prototype.getCurrentUrl = function () {
        return location.hash.substring(1);
    };

    HashHistoryManager.prototype.getHref = function (url) {
        if (!url)
            throw new Error('The Url is invalid');
        return '#' + url;
    };

    HashHistoryManager.prototype.getUrl = function (anchor) {
        return anchor.hash.substring(1);
    };
    return HashHistoryManager;
})();
module.exports = HashHistoryManager;
//# sourceMappingURL=HashHistoryManager.js.map
