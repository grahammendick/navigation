declare module '@cycle/dom' {
    export = CycleDOM;
} 

declare module CycleDOM {
    export var a: (properties: any, children: string | any[]) => string;
}
