import StateContext from "../StateContext";

interface HistoryManager {
    disabled: boolean;
    init(navigateHistory: (url?: string) => void, rewriteUrl: (url: string) => string | undefined): void;
    addHistory(url: string, replace: boolean, stateContext: StateContext): void;
    getCurrentUrl(): string;
    getHref(url: string): string;
    getUrl(hrefElement: HTMLAnchorElement | Location): string;
    stop(): void;
}
export default HistoryManager;
