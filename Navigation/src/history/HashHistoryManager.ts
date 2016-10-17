import HistoryManager from './HistoryManager';

class HashHistoryManager implements HistoryManager {
    private navigateHistory: () => void;
    private replaceQueryIdentifier: boolean = false;
    disabled: boolean = (typeof window === 'undefined') || !('onhashchange' in window);
    
    constructor(replaceQueryIdentifier: boolean = false) {
        this.replaceQueryIdentifier = replaceQueryIdentifier;
    }

    init(navigateHistory) {
        this.navigateHistory = navigateHistory;
        if (!this.disabled) {
            if (window.addEventListener)
                window.addEventListener('hashchange', this.navigateHistory);
            else
                window['attachEvent']('onhashchange', this.navigateHistory);
        }
    }

    addHistory(url: string, replace: boolean) {
        var href = this.getHref(url);
        if (!this.disabled && location.hash !== href) {
            if (!replace)            
                location.hash = href;
            else
                location.replace(href);
        }
    }

    getCurrentUrl(): string {
        return this.getUrl(location);
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
        if (!this.disabled) {
            if (window.removeEventListener)
                window.removeEventListener('hashchange', this.navigateHistory);
            else
                window['detachEvent']('onhashchange', this.navigateHistory);
        }
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
