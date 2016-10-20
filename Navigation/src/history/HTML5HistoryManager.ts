import HistoryManager from './HistoryManager';

class HTML5HistoryManager implements HistoryManager {
    private navigateHistory: () => void;
    private applicationPath: string = '';
    disabled: boolean = (typeof window === 'undefined') || !(window.history && window.history.pushState);
    
    constructor(applicationPath: string = '') {
        this.applicationPath = HTML5HistoryManager.prependSlash(applicationPath);
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
        return this.getUrl(location);
    }

    getHref(url: string): string {
        if (url == null)
            throw new Error('The Url is invalid');
        return this.applicationPath + HTML5HistoryManager.prependSlash(url);
    }

    getUrl(hrefElement: HTMLAnchorElement | Location) {
        return hrefElement.pathname.substring(this.applicationPath.length) + hrefElement.search;
    }
    
    stop() {
        if (!this.disabled)
            window.removeEventListener('popstate', this.navigateHistory);
    }

    private static prependSlash(url: string): string {
        return (url && url.substring(0, 1) !== '/') ? '/' + url : url;
    }
}
export default HTML5HistoryManager;
