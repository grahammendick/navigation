import HistoryManager from './HistoryManager';

class HashHistoryManager implements HistoryManager {
    private navigateHistory: () => void = null;
    private replaceQueryIdentifier: boolean = false;
    disabled: boolean = (typeof window === 'undefined') || !('onhashchange' in window);
    
    constructor(replaceQueryIdentifier: boolean = false) {
        this.replaceQueryIdentifier = replaceQueryIdentifier;
    }

    init(navigateHistory) {
        if (!this.disabled && !this.navigateHistory) {
            this.navigateHistory = () => navigateHistory();
            if (window.addEventListener)
                window.addEventListener('hashchange', this.navigateHistory);
            else
                window['attachEvent']('onhashchange', this.navigateHistory);
        }
    }

    addHistory(url: string, replace: boolean) {
        var href = this.getHref(url);
        if (!this.disabled && window.location.hash !== href) {
            if (!replace)            
                window.location.hash = href;
            else
                window.location.replace(href);
        }
    }

    getCurrentUrl(): string {
        return this.getUrl(window.location);
    }

    getHref(url: string): string {
        if (url == null)
            throw new Error('The Url is invalid');
        return '#' + this.encode(url);
    }

    getUrl(hrefElement: HTMLAnchorElement | Location) {
        return this.decode(hrefElement.hash.substring(1));
    }
    
    stop() {
        if (this.navigateHistory) {
            if (window.removeEventListener)
                window.removeEventListener('hashchange', this.navigateHistory);
            else
                window['detachEvent']('onhashchange', this.navigateHistory);
        }
        this.navigateHistory = null;
    }

    private encode(url: string): string {
        if (!this.replaceQueryIdentifier)
            return url;
        return url.replace('?', '#');
    }

    private decode(hash: string): string {
        if (!this.replaceQueryIdentifier)
            return hash;
        return hash.replace('#', '?');
    }
}
export default HashHistoryManager;
