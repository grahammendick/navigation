import HistoryManager from './HistoryManager';

class HTML5HistoryManager implements HistoryManager {
    private navigateHistory: (e: PopStateEvent) => void = null;
    private applicationPath: string = '';
    disabled: boolean = (typeof window === 'undefined') || !(window.history && window.history.pushState);
    
    constructor(applicationPath: string = '') {
        this.applicationPath = HTML5HistoryManager.prependSlash(applicationPath);
    }

    init(navigateHistory: (url?: string) => void) {
        if (!this.disabled && !this.navigateHistory) {
            this.navigateHistory = e => navigateHistory(e.state || undefined);
            window.addEventListener('popstate', this.navigateHistory);
        }
    }

    addHistory(url: string, replace: boolean) {
        var href = this.getHref(url);
        if (!this.disabled && this.getHref(this.getUrl(window.location)) !== href) {
            if (!replace)            
                window.history.pushState(url, null, href);
            else
                window.history.replaceState(url, null, href);
        }
    }

    getCurrentUrl(): string {
        return this.getUrl(window.location);
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
        if (this.navigateHistory)
            window.removeEventListener('popstate', this.navigateHistory);
        this.navigateHistory = null;
    }

    private static prependSlash(url: string): string {
        return (url && url.substring(0, 1) !== '/') ? '/' + url : url;
    }
}
export default HTML5HistoryManager;
