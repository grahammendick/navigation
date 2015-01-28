module Navigation {
    export class State {
        states: Array<Transition>;
        parent: Dialog;
        index: number;
        key: string;
        title: string;
    }
}
