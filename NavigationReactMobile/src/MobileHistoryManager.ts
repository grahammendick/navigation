import { HTML5HistoryManager } from 'navigation';

class MobileHistoryManager extends HTML5HistoryManager {
    private hash = false;

    constructor(applicationPath = '', hash = false) {
        super(applicationPath);
        this.hash = hash;
    }

    getHref(url: string): string {
        // remove crumbs from url
        return !this.hash ? super.getHref(url) : '#' + url;
    }

    getUrl(hrefElement: HTMLAnchorElement | Location) {
        return !this.hash ? super.getUrl(hrefElement) : hrefElement.hash.substring(1);
    }
}

export default MobileHistoryManager;
