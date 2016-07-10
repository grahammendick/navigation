declare module 'inferno-component' {
    export = InfernoComponent;
} 

declare class InfernoComponent {
    props: any;
    context: any;
    refs: any;
    forceUpdate();
}
