import HistoryManager from './HistoryManager';

class HTML5HistoryManager implements HistoryManager {
    private navigateHistory: (e: PopStateEvent) => void = null;
    private applicationPath: string = '';
    private rewriteUrl: (url: string) => string | undefined;
    disabled: boolean = (typeof window === 'undefined') || !(window.history && window.history.pushState);
    
    constructor(applicationPath: string = '') {
        this.applicationPath = HTML5HistoryManager.prependSlash(applicationPath);
    }

    init(navigateHistory: (url?: string) => void, rewriteUrl: (url: string) => string | undefined) {
        if (!this.rewriteUrl) this.rewriteUrl = rewriteUrl;
        if (!this.disabled && !this.navigateHistory) {
            this.navigateHistory = e => navigateHistory((e.state && e.state.navigationLink) || undefined);
            window.addEventListener('popstate', this.navigateHistory);
        }
    }

    addHistory(url: string, replace: boolean) {
        if (!this.disabled && (window.history.state?.navigationLink || this.getUrl(window.location)) !== url) {
            if (!replace)            
                window.history.pushState({navigationLink: url}, null, this.getHref(url));
            else
                window.history.replaceState({...window.history.state, navigationLink: url}, null, this.getHref(url));
        }
    }

    getCurrentUrl(): string {
        return window.history.state?.navigationLink || this.getUrl(window.location);
    }

    getHref(url: string): string {
        if (url == null)
            throw new Error('The Url is invalid');
        return this.applicationPath + HTML5HistoryManager.prependSlash(this.rewriteUrl?.(url) || url);
    }

    getUrl(hrefElement: HTMLAnchorElement | Location) {
        return hrefElement.pathname.substring(this.applicationPath.length) + hrefElement.search + hrefElement.hash;
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
