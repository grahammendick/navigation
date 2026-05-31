import { HTML5HistoryManager, StateContext } from 'navigation';

class MobileHistoryManager extends HTML5HistoryManager {
    private navigateHistory: (e: PopStateEvent) => void = null;
    private onNavigate: (e: NavigateEvent) => void = null;
    private backCrumb: {crumbs: number, url: string} | null = null;
    private hash = false;
    private buildCurrentUrl: (url: string) => string;
    private rewriteUrl: (url: string) => string | undefined;

    constructor(buildCurrentUrl: (url: string) => string, applicationPath?: string) {
        super(applicationPath || '');
        this.buildCurrentUrl = buildCurrentUrl;
        this.hash = applicationPath === undefined;
    }

    init(navigateHistory: (url?: string) => void, rewriteUrl: (url: string) => string | undefined) {
        if (!this.rewriteUrl) this.rewriteUrl = rewriteUrl;
        if (!this.disabled && !this.navigateHistory) {
            this.navigateHistory = e => {
                if (this.onNavigate) return;
                var link = e.state?.navigationLink;
                if (this.backCrumb !== null) {
                    var distance = link ? this.backCrumb.crumbs - link.split('crumb=').length + 1 : 0;
                    if (distance < 0)
                        window.history.go(distance);
                    else {
                        super.addHistory(this.backCrumb.url, true);
                        this.backCrumb = null;
                    }
                } else {
                    navigateHistory(link);
                }
            };
            window.addEventListener('popstate', this.navigateHistory);
        }
    }

    navigate(url: string, replace: boolean, controller: NavigationPrecommitController, stateContext?: StateContext): NavigationResult | null {
        if (!!stateContext && !stateContext.history && !controller) {
            var {oldUrl, crumbs} = stateContext;
            var start = !oldUrl ? 0 : oldUrl.split('crumb=').length;
            var distance = crumbs.length - start + 1;
            if (distance < 0) {
                this.backCrumb = {crumbs: crumbs.length, url};
                var entries = window.navigation.entries();
                for(var i = entries.length - 1; i >= 0; i--) {
                    var link = entries[i].getState()?.navigationLink || this.getUrl(new URL(entries[i].url));
                    distance = link ? this.backCrumb.crumbs - link.split('crumb=').length + 1 : 0;
                    if (!distance) {
                        const res = window.navigation.traverseTo(entries[i].key);
                        res.committed.then(() => this.backCrumb = null);
                        return res;
                    }
                }
            }
        }
        return super.navigate(url, replace, controller);
    }

    addHistory(url: string, replace: boolean, stateContext?: StateContext) {
        this.backCrumb = null;
        var title = typeof document !== 'undefined' && document.title;
        var distance = 0;
        if (!!stateContext && !stateContext.history) {
            var {oldUrl, crumbs} = stateContext;
            var start = !oldUrl ? 0 : oldUrl.split('crumb=').length;
            distance = crumbs.length - start + 1;
            for(var i = start; i < crumbs.length; i++) {
                let {url, state} = crumbs[i];
                super.addHistory(url, i === 0);
                if (typeof document !== 'undefined' && state.title)
                    document.title = state.title;
            }
            if (!this.disabled && distance < 0) {
                this.backCrumb = {crumbs: crumbs.length, url};
                if (this.onNavigate) {
                    var entries = window.navigation.entries();
                    for(var i = entries.length - 1; i >= 0 && this.backCrumb !== null; i--) {
                        var link = entries[i].getState()?.navigationLink || this.getUrl(new URL(entries[i].url));
                        var distance = link ? this.backCrumb.crumbs - link.split('crumb=').length + 1 : 0;
                        if (!distance) {
                            if (window.navigation.currentEntry !== entries[i]) {
                                var {committed} = window.navigation.traverseTo(entries[i].key);
                                committed.then(() => {
                                    super.addHistory(url, true);
                                    this.backCrumb = null;
                                });
                            } else {
                                super.addHistory(url, true);
                                this.backCrumb = null;
                            }
                        }
                    }
                } else {
                    window.history.go(distance);
                }
            }
        }
        if (this.backCrumb === null && !this.onNavigate)
            super.addHistory(url, replace);
        if (title)
            document.title = title;
    }

    interceptHistory(intercept: (navigationLink: string, e: NavigateEvent) => Promise<void>) {
        if (this.onNavigate)
            window.navigation.removeEventListener('navigate', this.onNavigate);
        if (!this.disabled && !!intercept) {
            this.onNavigate = (e: NavigateEvent) => {
                if (e.navigationType !== 'traverse' || !e.canIntercept || this.backCrumb !== null) return;
                const navigationLink = e.destination.getState()?.navigationLink || this.getUrl(new URL(e.destination.url));
                e.intercept({
                    focusReset: 'manual',
                    scroll: 'manual',
                    async precommitHandler() {
                        return intercept(navigationLink, e);
                    }
                });
            };
            window.navigation?.addEventListener('navigate', this.onNavigate);
        }
    }

    getHref(url: string): string {
        url = this.rewriteUrl?.(url) || url;
        var hashIndex = url.indexOf('#');
        var pathAndQuery = hashIndex < 0 ? url : url.substring(0, hashIndex);
        var queryIndex = pathAndQuery.indexOf('?');
        if (queryIndex >= 0) {
            var path = pathAndQuery.substring(0, queryIndex);
            var query = pathAndQuery.substring(queryIndex + 1);
            var params = query.split('&');
            var crumblessParams = [];
            for (var i = 0; i < params.length; i++) {
                if (params[i].substring(0, 6) !== 'crumb=') {
                    crumblessParams.push(params[i])
                }
            }
            var crumblessQuery = crumblessParams.join('&');
            var hash = hashIndex >= 0 ? url.substring(hashIndex) : '';
            url = `${path}${crumblessQuery && '?'}${crumblessQuery}${hash}`;
        }
        return !this.hash ? super.getHref(url) : '#' + url;
    }

    getUrl(hrefElement: HTMLAnchorElement | Location | URL) {
        return !this.hash ? super.getUrl(hrefElement) : hrefElement.hash.substring(1);
    }

    getCurrentUrl(): string {
        var url = super.getCurrentUrl();
        if (this.buildCurrentUrl)
            url = this.buildCurrentUrl(url);
        return url;
    }
    
    stop() {
        if (this.navigateHistory)
            window.removeEventListener('popstate', this.navigateHistory);
        if (this.onNavigate)
            window.navigation.removeEventListener('navigate', this.onNavigate);
        this.navigateHistory = null;
        this.onNavigate = null;
    }
}

export default MobileHistoryManager;
