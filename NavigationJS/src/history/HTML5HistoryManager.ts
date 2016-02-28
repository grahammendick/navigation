import HistoryManager = require('./HistoryManager');

class HTML5HistoryManager implements HistoryManager {
    private navigateHistory: () => void;
    private applicationPath: string = '';
    disabled: boolean = (typeof window === 'undefined') || !(window.history && window.history.pushState);
    
    constructor(applicationPath: string = '') {
        this.applicationPath = applicationPath;
    }

    init(navigateHistory: () => void) {
        this.navigateHistory = navigateHistory;
        if (!this.disabled)
            window.addEventListener('popstate', this.navigateHistory);
    }

    addHistory(url: string, replace: boolean) {
        var href = this.getHref(url);
        if (!this.disabled && location.pathname + location.search !== href) {
            if (!replace)            
                window.history.pushState(null, null, href);
            else
                window.history.replaceState(null, null, href);
        }
    }

    getCurrentUrl(): string {
        return location.pathname.substring(this.applicationPath.length) + location.search;
    }

    getHref(url: string): string {
        if (url == null)
            throw new Error('The Url is invalid');
        return this.applicationPath + url;
    }

    getUrl(anchor: HTMLAnchorElement) {
        return anchor.pathname.substring(this.applicationPath.length) + anchor.search;
    }
    
    stop() {
        if (!this.disabled)
            window.removeEventListener('popstate', this.navigateHistory);
    }
}
export = HTML5HistoryManager;
