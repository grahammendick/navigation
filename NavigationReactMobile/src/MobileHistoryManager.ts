import { HTML5HistoryManager } from 'navigation';

class MobileHistoryManager extends HTML5HistoryManager {
    private hash = false;
    private buildCurrentUrl: (url: string) => string; 

    constructor(buildCurrentUrl: (url: string) => string, applicationPath?: string) {
        super(applicationPath || '');
        this.buildCurrentUrl = buildCurrentUrl;
        this.hash = applicationPath === undefined;
    }

    getHref(url: string): string {
        var queryIndex = url.indexOf('?');
        if (queryIndex >= 0) {
            var path = url.substring(0, queryIndex);            
            var query = url.substring(queryIndex + 1);
            var params = query.split('&');
            var crumblessParams = [];
            for (var i = 0; i < params.length; i++) {
                if (params[i].substring(0, 6) !== 'crumb=') {
                    crumblessParams.push(params[i])
                }
            }
            var crumblessQuery = crumblessParams.join('&');
            url = `${path}${crumblessQuery && '?'}${crumblessQuery}`;
        }
        return !this.hash ? super.getHref(url) : '#' + url;
    }

    getUrl(hrefElement: HTMLAnchorElement | Location) {
        return !this.hash ? super.getUrl(hrefElement) : hrefElement.hash.substring(1);
    }

    getCurrentUrl(): string {
        var url = this.getUrl(location);
        if (this.buildCurrentUrl)
            url = this.buildCurrentUrl(url);
        return url;
    }
}

export default MobileHistoryManager;
