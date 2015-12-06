interface IState<TTransitions> {
    transitions?: TTransitions;
    key: string;
    defaults?: any;
    defaultTypes?: any;
    title?: string;
    route: string | string[];
    trackCrumbTrail?: boolean;
    trackTypes?: boolean;
    [extras: string]: any;
}
export = IState;