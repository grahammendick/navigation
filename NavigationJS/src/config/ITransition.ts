interface ITransition<TState> {
    to: TState;
    key: string;
}
export = ITransition;