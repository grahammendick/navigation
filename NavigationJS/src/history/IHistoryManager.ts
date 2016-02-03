import StateContext = require('../StateContext');

interface IHistoryManager {
    disabled: boolean;
    init();
    addHistory(stateContext: StateContext, url: string, replace?: boolean): void;
    getCurrentUrl(): string;
    getHref(url: string): string;
    getUrl(anchor: HTMLAnchorElement): string;
}
export = IHistoryManager;
