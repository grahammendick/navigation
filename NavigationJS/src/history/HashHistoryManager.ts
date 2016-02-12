import IHistoryManager = require('./IHistoryManager');

class HashHistoryManager implements IHistoryManager {
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
        url = '#' + this.encode(url);
        if (!this.disabled && location.hash !== url) {
            if (!replace)            
                location.hash = url;
            else
                location.replace(url);
        }
    }

    getCurrentUrl(): string {
        return this.decode(location.hash.substring(1));
    }

    getHref(url: string): string {
        if (!url)
            throw new Error('The Url is invalid');
        return '#' + this.encode(url);
    }

    getUrl(anchor: HTMLAnchorElement) {
        return this.decode(anchor.hash.substring(1));
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
export = HashHistoryManager;
