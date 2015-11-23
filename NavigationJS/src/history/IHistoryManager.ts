import State = require('../config/State');

interface IHistoryManager {
    disabled: boolean;
    init();
    addHistory(state: State, url: string, replace: boolean): void;
    getCurrentUrl(): string;
    getHref(url: string): string;
    getUrl(anchor: HTMLAnchorElement): string;
}
export = IHistoryManager;
