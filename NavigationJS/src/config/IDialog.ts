interface IDialog<TState, TStates> {
    states: TStates;
    initial: TState;
    key: string;
    title?: string;
    [extras: string]: any;
}
export = IDialog;