declare module 'rx' {
    export = Rx;
} 

declare module Rx {
    class BehaviorSubject {
        onNext(item: any): void;
    }
}
