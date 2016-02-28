interface HistoryManager {
    disabled: boolean;
    init(navigateHistory: () => void): void;
    addHistory(url: string, replace: boolean): void;
    getCurrentUrl(): string;
    getHref(url: string): string;
    getUrl(anchor: HTMLAnchorElement): string;
    stop(): void;
}
export = HistoryManager;
