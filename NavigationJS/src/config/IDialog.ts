interface IDialog<TState, TStates> {
	states: TStates;
	initial: TState;
	key: string;
	title?: string;
}
export = IDialog;