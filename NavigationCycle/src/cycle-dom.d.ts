declare module '@cycle/dom' {
    export = CycleDOM;
} 

declare module CycleDOM {
    export var a: (attributes: any, children: string | any[]) => string;
}
