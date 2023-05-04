import HistoryManager from './HistoryManager';
import HTML5HistoryManager from './HTML5HistoryManager';

class HashHistoryManager extends HTML5HistoryManager {
    private replaceQueryIdentifier: boolean = false;
    
    constructor(replaceQueryIdentifier: boolean = false) {
        super('');
        this.replaceQueryIdentifier = replaceQueryIdentifier;
    }

    getHref(url: string): string {
        if (url == null)
            throw new Error('The Url is invalid');
        return '#' + this.encode(super.getHref(url));
    }

    getUrl(hrefElement: HTMLAnchorElement | Location) {
        return this.decode(hrefElement.hash.substring(1));
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
