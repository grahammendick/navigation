module Navigation {
    export class Transition {
        to: State;
        parent: State;
        index: number;
        key: string;
    }
}
