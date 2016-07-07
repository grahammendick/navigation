declare module 'inferno-dom' {
    export = InfernoDOM;
} 

declare module InfernoDOM {
    export var findDOMNode: (component: any) => HTMLElement;
}
