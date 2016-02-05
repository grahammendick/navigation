import IHistoryManager = require('./IHistoryManager');
import StateContext = require('../StateContext');

class HTML5HistoryManager implements IHistoryManager {
    disabled: boolean = (typeof window === 'undefined') || !(window.history && window.history.pushState);

    init(navigateHistory: () => void) {
        if (!this.disabled)
            window.addEventListener('popstate', navigateHistory);
    }

    addHistory(url: string, replace: boolean, applicationPath: string) {
        url = applicationPath + url;
        if (!this.disabled && location.pathname + location.search !== url) {
            if (!replace)            
                window.history.pushState(null, null, url);
            else
                window.history.replaceState(null, null, url);
        }
    }

    getCurrentUrl(applicationPath: string): string {
        return location.pathname.substring(applicationPath.length) + location.search;
    }

    getHref(url: string, applicationPath: string): string {
        if (!url)
            throw new Error('The Url is invalid');
        return applicationPath + url;
    }

    getUrl(anchor: HTMLAnchorElement, applicationPath: string) {
        return anchor.pathname.substring(applicationPath.length) + anchor.search;
    }
}
export = HTML5HistoryManager;
