import IHistoryManager = require('./IHistoryManager');

class HTML5HistoryManager implements IHistoryManager {
    private navigateHistory: () => void;
    private applicationPath: string;
    disabled: boolean = (typeof window === 'undefined') || !(window.history && window.history.pushState);

    init(navigateHistory: () => void, applicationPath: string) {
        this.navigateHistory = navigateHistory;
        this.applicationPath = applicationPath;
        if (!this.disabled)
            window.addEventListener('popstate', this.navigateHistory);
    }

    addHistory(url: string, replace: boolean) {
        url = this.applicationPath + url;
        if (!this.disabled && location.pathname + location.search !== url) {
            if (!replace)            
                window.history.pushState(null, null, url);
            else
                window.history.replaceState(null, null, url);
        }
    }

    getCurrentUrl(): string {
        return location.pathname.substring(this.applicationPath.length) + location.search;
    }

    getHref(url: string): string {
        if (!url)
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
