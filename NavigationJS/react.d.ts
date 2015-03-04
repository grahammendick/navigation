// Type definitions for React v0.12.0
// Project: http://facebook.github.io/react/
// Definitions by: @wizzard0 <https://github.com/wizzard0/>
// Definitions by: @fdecampredon <https://github.com/fdecampredon/>
// Definitions: https://github.com/wizzard0/react-typescript-definitions/
// License: MIT

declare module 'react' {
    export = React;
}

declare module React {

    interface ReactElement<P, S> {
        type: string;
        props: P;
        key: string; // | boolean | number
        ref : string;
    }

    interface ReactClass<P, S> {

    }

    function createElement<P, S>(type: ReactClass<P, S>, config?: P, ...children: any[]): ReactElement<P, S>

    function createFactory<P, S>(type: ReactClass<P, S>): ReactComponentFactory<P>;

    /**
    * Render a ReactElement into the DOM in the supplied container and return a reference to the component.
    * If the ReactElement was previously rendered into container, this will perform an update on it and only mutate the DOM as necessary to reflect the latest React component.
    * If the optional callback is provided, it will be executed after the component is rendered or updated.
    */
    function render(element: ReactElement<any, any>, domElement: Element, callback?: Function): void;

    /**
     * Configure React's event system to handle touch events on mobile devices.
     * @param shouldUseTouch true if React should active touch events, false if it should not  
     */
    function initializeTouchEvents(shouldUseTouch: boolean): void;

    /**
     * Create a component given a specification. A component implements a render method which returns one single child. 
     * That child may have an arbitrarily deep child structure. 
     * One thing that makes components different than standard prototypal classes is that you don't need to call new on them. 
     * They are convenience wrappers that construct backing instances (via new) for you.
     * 
     * @param spec the component specification
     */
    // we need mixins and type union here, until that manually specifies the type.
    function createClass<P, S>(spec: ReactComponentSpec<P, S>): ReactClass<P, S>;

    /**
     * Render a React component into the DOM in the supplied container.
     * If the React component was previously rendered into container, 
     * this will perform an update on it and only mutate the DOM as necessary to reflect the latest React component.
     * 
     * @param component the component to render
     * @param container the node that should contain the result of rendering
     * @param callback an optional callback that will be executed after the component is rendered or updated. 
     * @deprecated
     */
    function renderComponent<C extends ReactComponent<any, any>>(component: C, container: Element, callback?: () => void): C;

    /**
     * Remove a mounted React component from the DOM and clean up its event handlers and state. 
     * If no component was mounted in the container, calling this function does nothing. 
     * Returns true if a component was unmounted and false if there was no component to unmount.
     * 
     * @param container the node that should be cleaned from React component
     */
    function unmountComponentAtNode(container: Element): boolean;

    /**
     * Render a component to its initial HTML. This should only be used on the server.
     * React will return an HTML string. You can use this method to generate HTML on the server
     * and send the markup down on the initial request for faster page loads and to allow search
     * engines to crawl your pages for SEO purposes.
     *
     * If you call React.renderComponent() on a node that already has this server-rendered markup,
     * React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
     * 
     * @param component the component to render
     */
    function renderComponentToString(component: ReactComponent<any, any>): string;

    /**
     * Similar to renderComponentToString, except this doesn't create extra DOM
     * attributes such as data-react-id, that React uses internally. This is useful
     * if you want to use React as a simple static page generator, as stripping
     * away the extra attributes can save lots of bytes.
     *
     * @param component the component to render
     */
    function renderComponentToStaticMarkup(component: ReactComponent<any, any>): string;

    /**
     * Built-in Prop Type Validators
     * (incomplete)
    */
    export var PropTypes: ReactPropTypes;
    export var addons: any;

    interface ReactPropTypes {
        'number': PropTypeValidator;
        'string': PropTypeValidator;
        'any': PropTypeValidator;
        'func': PropTypeValidator;
        'object': PropTypeValidator;
        'array': PropTypeValidator;
        'arrayOf': TypedArrayValidatorFactory;
        'shape': ShapedObjectValidatorFactory;
        'bool': PropTypeValidator;
    }

    interface PropTypeValidatorOptions {
        [key: string]: PropTypeValidator;
    }

    interface ShapedObjectValidatorFactory {
        (opts: PropTypeValidatorOptions): PropTypeValidator;
    }

    interface TypedArrayValidatorFactory {
        (elementType: PropTypeValidator): PropTypeValidator;
    }

    interface PropTypeValidator {
        isRequired?: RequiredPropTypeValidator
    }

    interface RequiredPropTypeValidator extends PropTypeValidator {

    }

    /**
     * Component classses created by createClass() return instances of ReactComponent when called. 
     * Most of the time when you're using React you're either creating or consuming these component objects.
     */
    interface ReactComponent<P, S> {

        refs: { [ref: string]: ReactComponent<any, any>; }
        /**
         * If this component has been mounted into the DOM, this returns the corresponding native browser DOM element. 
         * This method is useful for reading values out of the DOM, such as form field values and performing DOM measurements.
         */
        getDOMNode(): Element;

        /**
         * When you're integrating with an external JavaScript application you may want to signal a change to a React component rendered with renderComponent(). 
         * Simply call setProps() to change its properties and trigger a re-render.
         * 
         * @param nextProps the object that will be merged with the component's props
         * @param callback an optional callback function that is executed once setProps is completed.
         */
        setProps(nextProps: P, callback?: () => void): void;

        /**
         * Like setProps() but deletes any pre-existing props instead of merging the two objects.
         * 
         * @param nextProps the object that will replace the component's props
         * @param callback an optional callback function that is executed once replaceProps is completed.
         */
        replaceProps(nextProps: P, callback?: () => void): void;

        /**
         * Transfer properties from this component to a target component that have not already been set on the target component. 
         * After the props are updated, targetComponent is returned as a convenience. 
         * 
         * @param target the component that will receive the props
         */
        transferPropsTo<C extends ReactComponent<P, any>>(target: C): C;

        /**
         * Merges nextState with the current state. 
         * This is the primary method you use to trigger UI updates from event handlers and server request callbacks. 
         * In addition, you can supply an optional callback function that is executed once setState is completed.
         * 
         * @param nextState the object that will be merged with the component's state
         * @param callback an optional callback function that is executed once setState is completed.
         */
        setState(nextState: S, callback?: () => void): void;

        /**
         * Like setState() but deletes any pre-existing state keys that are not in nextState.
         * 
         * @param nextState the object that will replace the component's state
         * @param callback an optional callback function that is executed once replaceState is completed.
         */
        replaceState(nextState: S, callback?: () => void): void;

        /**
         * If your render() method reads from something other than this.props or this.state, 
         * you'll need to tell React when it needs to re-run render() by calling forceUpdate(). 
         * You'll also need to call forceUpdate() if you mutate this.state directly.
         * Calling forceUpdate() will cause render() to be called on the component and its children, 
         * but React will still only update the DOM if the markup changes.
         * Normally you should try to avoid all uses of forceUpdate() and only read from this.props and this.state in render(). 
         * This makes your application much simpler and more efficient.
         * 
         * @param callback an optional callback that is executed once forceUpdate is completed.
         */
        forceUpdate(callback?: () => void): void;
    }


    interface ReactComponentFactory<P> {
        (properties?: P, ...children: any[]): ReactComponent<P, any>
    }
    /**
     * interface describing ReactComponentSpec
     */
    interface ReactMixin<P, S> {

        /**
         * Invoked immediately before rendering occurs. 
         * If you call setState within this method, render() will see the updated state and will be executed only once despite the state change.
         */
        componentWillMount? (): void;

        /**
         * Invoked immediately after rendering occurs. 
         * At this point in the lifecycle, the component has a DOM representation which you can access via the rootNode argument or by calling this.getDOMNode().
         * If you want to integrate with other JavaScript frameworks, set timers using setTimeout or setInterval, 
         * or send AJAX requests, perform those operations in this method.
         */
        componentDidMount? (): void;

        /**
         * Invoked when a component is receiving new props. This method is not called for the initial render.
         * 
         * Use this as an opportunity to react to a prop transition before render() is called by updating the state using this.setState(). 
         * The old props can be accessed via this.props. Calling this.setState() within this function will not trigger an additional render.
         * 
         * @param nextProps the props object that the component will receive
         */
        componentWillReceiveProps? (nextProps: P): void;

        /**
         * Invoked before rendering when new props or state are being received. 
         * This method is not called for the initial render or when forceUpdate is used.
         * Use this as an opportunity to return false when you're certain that the transition to the new props and state will not require a component update.
         * By default, shouldComponentUpdate always returns true to prevent subtle bugs when state is mutated in place, 
         * but if you are careful to always treat state as immutable and to read only from props and state in render() 
         * then you can override shouldComponentUpdate with an implementation that compares the old props and state to their replacements.
         * 
         * If performance is a bottleneck, especially with dozens or hundreds of components, use shouldComponentUpdate to speed up your app.
         * 
         * @param nextProps the props object that the component will receive
         * @param nextState the state object that the component will receive
         */
        shouldComponentUpdate? (nextProps: P, nextState: S): boolean;

        /**
         * Invoked immediately before rendering when new props or state are being received. This method is not called for the initial render.
         * Use this as an opportunity to perform preparation before an update occurs.
         * 
         * @param nextProps the props object that the component has received
         * @param nextState the state object that the component has received
         */
        componentWillUpdate? (nextProps: P, nextState: S): void;

        /**
         * Invoked immediately after updating occurs. This method is not called for the initial render.
         * Use this as an opportunity to operate on the DOM when the component has been updated.
         * 
         * @param nextProps the props object that the component has received
         * @param nextState the state object that the component has received
         */
        componentDidUpdate? (nextProps: P, nextState: S): void;

        /**
         * Invoked immediately before a component is unmounted from the DOM.
         * Perform any necessary cleanup in this method, such as invalidating timers or cleaning up any DOM elements that were created in componentDidMount.
         */
        componentWillUnmount? (): void;
    }


    interface ReactComponentSpec<P, S> extends ReactMixin<P, S> {

        /**
        * The mixins array allows you to use mixins to share behavior among multiple components. 
        */
        mixins?: ReactMixin<any, any>[];

        /**
         * The displayName string is used in debugging messages. JSX sets this value automatically.
         */
        displayName?: string;

        /**
         * The propTypes object allows you to validate props being passed to your components.
         */
        propTypes?: PropTypeValidatorOptions;

        /**
         * Invoked once before the component is mounted. The return value will be used as the initial value of this.state.
         */
        getInitialState? (): S;


        /**
         * The render() method is required. When called, it should examine this.props and this.state and return a single child component. 
         * This child component can be either a virtual representation of a native DOM component (such as <div /> or React.DOM.div()) 
         * or another composite component that you've defined yourself.
         * The render() function should be pure, meaning that it does not modify component state, it returns the same result each time it's invoked, 
         * and it does not read from or write to the DOM or otherwise interact with the browser (e.g., by using setTimeout). 
         * If you need to interact with the browser, perform your work in componentDidMount() or the other lifecycle methods instead. 
         * Keeping render() pure makes server rendering more practical and makes components easier to think about.
         */
        render(): ReactElement<any, any>;


        /**
         * Invoked once when the component is mounted. 
         * Values in the mapping will be set on this.props if that prop is not specified by the parent component (i.e. using an in check).
         * This method is invoked before getInitialState and therefore cannot rely on this.state or use this.setState.
         */
        getDefaultProps? (): P;

    }

    export interface SyntheticEvent {
        bubbles: boolean;
        cancelable: boolean;
        currentTarget: EventTarget;
        defaultPrevented: boolean;
        eventPhase: number;
        isTrusted: boolean
        nativeEvent: Event;
        target: EventTarget
        type: string;
        timeStamp: Date;

        preventDefault(): void;
        stopPropagation(): void;
    }

    export interface ClipboardEvent extends SyntheticEvent {
        clipboardData: DataTransfer;
    }

    export interface KeyboardEvent extends SyntheticEvent {
        altKey: boolean;
        ctrlKey: boolean;
        charCode: number;
        key: string;
        keyCode: number;
        locale: string;
        location: number;
        metaKey: boolean;
        repeat: boolean;
        shiftKey: boolean;
        which: number;
    }

    export interface FocusEvent extends SyntheticEvent {
        relatedTarget: EventTarget;
    }

    export interface FormEvent extends SyntheticEvent {
    }

    export interface MouseEvent extends SyntheticEvent {
        altKey: boolean;
        button: number;
        buttons: number;
        clientX: number;
        clientY: number;
        ctrlKey: boolean;
        metaKey: boolean
        pageX: number;
        pageY: number;
        relatedTarget: EventTarget;
        screenX: number;
        screenY: number;
        shiftKey: boolean;
    }


    export interface TouchEvent extends SyntheticEvent {
        altKey: boolean;
        changedTouches: TouchEvent;
        ctrlKey: boolean;
        metaKey: boolean;
        shiftKey: boolean;
        targetTouches: any//DOMTouchList;
        touches: any//DOMTouchList;
    }

    export interface UIEvent extends SyntheticEvent {
        detail: number;
        view: Window;
    }

    export interface WheelEvent {
        deltaX: number;
        deltaMode: number;
        deltaY: number;
        deltaZ: number;
    }

    interface ReactEvents {
        onCopy?: (event: ClipboardEvent) => void;
        onCut?: (event: ClipboardEvent) => void;
        onPaste?: (event: ClipboardEvent) => void;

        onKeyDown?: (event: KeyboardEvent) => void;
        onKeyPress?: (event: KeyboardEvent) => void;
        onKeyUp?: (event: KeyboardEvent) => void;

        onFocus?: (event: FocusEvent) => void;
        onBlur?: (event: FocusEvent) => void;

        onChange?: (event: FormEvent) => void;
        onInput?: (event: FormEvent) => void;
        onSubmit?: (event: FormEvent) => void;

        onClick?: (event: MouseEvent) => void;
        onDoubleClick?: (event: MouseEvent) => void;
        onDrag?: (event: MouseEvent) => void;
        onDragEnd?: (event: MouseEvent) => void;
        onDragEnter?: (event: MouseEvent) => void;
        onDragExit?: (event: MouseEvent) => void;
        onDragLeave?: (event: MouseEvent) => void;
        onDragOver?: (event: MouseEvent) => void;
        onDragStart?: (event: MouseEvent) => void;
        onDrop?: (event: MouseEvent) => void;
        onMouseDown?: (event: MouseEvent) => void;
        onMouseEnter?: (event: MouseEvent) => void;
        onMouseLeave?: (event: MouseEvent) => void;
        onMouseMove?: (event: MouseEvent) => void;
        onMouseUp?: (event: MouseEvent) => void;

        onTouchCancel?: (event: TouchEvent) => void;
        onTouchEnd?: (event: TouchEvent) => void;
        onTouchMove?: (event: TouchEvent) => void;
        onTouchStart?: (event: TouchEvent) => void;

        onScroll?: (event: UIEvent) => void;

        onWheel?: (event: WheelEvent) => void;
    }

    interface ReactAttributes {
        key?: string;
        ref?: string;
    }


    interface HTMLGlobalAttributes extends ReactAttributes, ReactEvents {
        key?: string;
        accessKey?: string;
        className?: string;
        contentEditable?: string;
        contextMenu?: string;
        dir?: string;
        draggable?: boolean;
        hidden?: boolean;
        id?: string;
        lang?: string;
        spellCheck?: boolean;
        role?: string;
        scrollLeft?: number;
        scrollTop?: number;
        style?: { [styleNam: string]: string };
        tabIndex?: number;
        title?: string;

        dangerouslySetInnerHTML?: {
            __html: string;
        };
    }

    interface FormAttributes extends HTMLGlobalAttributes {
        accept?: string;
        action?: string;
        autoCapitalize?: string;
        autoComplete?: string;
        encType?: string;
        method?: string;
        name?: string;
        target?: string;
    }

    interface InputAttributes extends HTMLGlobalAttributes {
        accept?: string;
        alt?: string;
        autoCapitalize?: string;
        autoComplete?: string;
        autoFocus?: boolean;
        checked?: any;
        defaultValue?: any;
        disabled?: boolean;
        form?: string;
        height?: number;
        list?: string;
        max?: number;
        maxLength?: number;
        min?: number;
        multiple?: boolean;
        name?: string;
        pattern?: string;
        placeholder?: string;
        readOnly?: boolean;
        required?: boolean;
        size?: number;
        src?: string;
        step?: number;
        type?: string;
        value?: string;
        width?: number;
    }

    interface IframeAttributes extends HTMLGlobalAttributes {
        allowFullScreen?: boolean;
        allowTransparency?: boolean;
        frameBorder?: number;
        height?: number;
        name?: string;
        src?: string;
        width?: number;
    }

    interface AppletAttributes extends HTMLGlobalAttributes {
        alt?: string;
    }

    interface AreaAttributes extends HTMLGlobalAttributes {
        alt?: string;
        href?: string;
        rel?: string;
        target?: string;
    }

    interface ImgAttributes extends HTMLGlobalAttributes {
        alt?: string;
        height?: number;
        src?: string;
        width?: number;
    }

    interface ButtonAttributes extends HTMLGlobalAttributes {
        autoFocus?: boolean;
        disabled?: boolean;
        form?: string;
        name?: string;
        type?: string;
        value?: string;
    }

    interface KeygenAttributes extends HTMLGlobalAttributes {
        autoFocus?: boolean;
        form?: string;
        name?: string;
    }

    interface SelectAttributes extends HTMLGlobalAttributes {
        autoFocus?: boolean;
        disabled?: boolean;
        form?: string;
        multiple?: boolean;
        name?: string;
        required?: boolean;
        size?: number;
    }

    interface TextareaAttributes extends HTMLGlobalAttributes {
        autoFocus?: boolean;
        form?: string;
        maxLength?: string;
        name?: string;
        placeholder?: string;
        readOnly?: string;
        required?: boolean;
    }

    interface AudioAttributes extends HTMLGlobalAttributes {
        autoPlay?: boolean;
        controls?: boolean;
        loop?: boolean;
        preload?: string;
        src?: string;
    }

    interface VideoAttributes extends HTMLGlobalAttributes {
        autoPlay?: boolean;
        controls?: boolean;
        height?: number;
        loop?: boolean;
        poster?: string;
        preload?: string;
        src?: string;
        width?: number;
    }

    interface TableAttributes extends HTMLGlobalAttributes {
        cellPadding?: number;
        cellSpacing?: number;
    }

    interface MetaAttributes extends HTMLGlobalAttributes {
        charSet?: string;
        content?: string;
        httpEquiv?: string;
        name?: string;
    }

    interface ScriptAttributes extends HTMLGlobalAttributes {
        charSet?: string;
        src?: string;
        type?: string;
    }

    interface CommandAttributes extends HTMLGlobalAttributes {
        checked?: boolean;
        icon?: string;
        radioGroup?: string;
        type?: string;
    }

    interface TdAttributes extends HTMLGlobalAttributes {
        colSpan?: number;
        rowSpan?: number;
    }

    interface ThAttributes extends HTMLGlobalAttributes {
        colSpan?: number;
        rowSpan?: number;
    }

    interface ObjectAttributes extends HTMLGlobalAttributes {
        data?: string;
        form?: string;
        height?: number;
        name?: string;
        type?: string;
        width?: number;
        wmode?: string;
    }

    interface DelAttributes extends HTMLGlobalAttributes {
        dateTime?: Date;
    }

    interface InsAttributes extends HTMLGlobalAttributes {
        dateTime?: Date;
    }

    interface TimeAttributes extends HTMLGlobalAttributes {
        dateTime?: Date;
    }

    interface FieldsetAttributes extends HTMLGlobalAttributes {
        form?: string;
        name?: string;
    }

    interface LabelAttributes extends HTMLGlobalAttributes {
        form?: string;
        htmlFor?: string;
    }

    interface MeterAttributes extends HTMLGlobalAttributes {
        form?: string;
        max?: number;
        min?: number;
        value?: number;
    }

    interface OutputAttributes extends HTMLGlobalAttributes {
        form?: string;
        htmlFor?: string;
        name?: string;
    }

    interface ProgressAttributes extends HTMLGlobalAttributes {
        form?: string;
        max?: number;
        value?: number;
    }

    interface CanvasAttributes extends HTMLGlobalAttributes {
        height?: number;
        width?: number;
    }

    interface EmbedAttributes extends HTMLGlobalAttributes {
        height?: number;
        src?: string;
        type?: string;
        width?: number;
    }

    interface AAttributes extends HTMLGlobalAttributes {
        href?: string;
        rel?: string;
        target?: string;
    }

    interface BaseAttributes extends HTMLGlobalAttributes {
        href?: string;
        target?: string;
    }

    interface LinkAttributes extends HTMLGlobalAttributes {
        href?: string;
        rel?: string;
    }

    interface TrackAttributes extends HTMLGlobalAttributes {
        label?: string;
        src?: string;
    }

    interface BgsoundAttributes extends HTMLGlobalAttributes {
        loop?: boolean;
    }

    interface MarqueeAttributes extends HTMLGlobalAttributes {
        loop?: boolean;
    }

    interface MapAttributes extends HTMLGlobalAttributes {
        name?: string;
    }

    interface ParamAttributes extends HTMLGlobalAttributes {
        name?: string;
        value?: string;
    }

    interface OptionAttributes extends HTMLGlobalAttributes {
        selected?: boolean;
        value?: string;
    }

    interface SourceAttributes extends HTMLGlobalAttributes {
        src?: string;
        type?: string;
    }

    interface StyleAttributes extends HTMLGlobalAttributes {
        type?: string;
    }

    

    interface MenuAttributes extends HTMLGlobalAttributes {
        type?: string;
    }

    interface LiAttributes extends HTMLGlobalAttributes {
        value?: string;
    }

    interface SVGAttributes extends ReactAttributes, ReactEvents {
        id?: string;
        cx?: number;
        cy?: number;
        d?: number;
        fill?: string;
        fx?: number;
        fy?: number;
        gradientTransform?: any;
        gradientUnits?: string;
        offset?: number;
        points?: any;
        r?: number;
        rx?: number;
        ry?: number;
        spreadMethod?: string;
        stopColor?: string;
        stopOpacity?: number;
        stroke?: string;
        strokeLinecap?: string;
        strokeWidth?: number;
        transform?: string;
        version?: number;
        viewBox?: any;
        x1?: number;
        x2?: number;
        x?: number;
        y1?: number;
        y2?: number;
        y?: number;
    }
  
    export var DOM: {



        a: ReactComponentFactory<AAttributes>;


        abbr: ReactComponentFactory<HTMLGlobalAttributes>;


        address: ReactComponentFactory<HTMLGlobalAttributes>;


        area: ReactComponentFactory<AreaAttributes>;


        article: ReactComponentFactory<HTMLGlobalAttributes>;


        aside: ReactComponentFactory<HTMLGlobalAttributes>;


        audio: ReactComponentFactory<AudioAttributes>;


        b: ReactComponentFactory<HTMLGlobalAttributes>;


        base: ReactComponentFactory<BaseAttributes>;


        bdi: ReactComponentFactory<HTMLGlobalAttributes>;


        bdo: ReactComponentFactory<HTMLGlobalAttributes>;


        big: ReactComponentFactory<HTMLGlobalAttributes>;


        blockquote: ReactComponentFactory<HTMLGlobalAttributes>;


        body: ReactComponentFactory<HTMLGlobalAttributes>;


        br: ReactComponentFactory<HTMLGlobalAttributes>;


        button: ReactComponentFactory<ButtonAttributes>;


        canvas: ReactComponentFactory<CanvasAttributes>;


        caption: ReactComponentFactory<HTMLGlobalAttributes>;


        cite: ReactComponentFactory<HTMLGlobalAttributes>;


        code: ReactComponentFactory<HTMLGlobalAttributes>;


        col: ReactComponentFactory<HTMLGlobalAttributes>;


        colgroup: ReactComponentFactory<HTMLGlobalAttributes>;


        data: ReactComponentFactory<HTMLGlobalAttributes>;


        datalist: ReactComponentFactory<HTMLGlobalAttributes>;


        dd: ReactComponentFactory<HTMLGlobalAttributes>;


        del: ReactComponentFactory<DelAttributes>;


        details: ReactComponentFactory<HTMLGlobalAttributes>;


        dfn: ReactComponentFactory<HTMLGlobalAttributes>;


        div: ReactComponentFactory<HTMLGlobalAttributes>;


        dl: ReactComponentFactory<HTMLGlobalAttributes>;


        dt: ReactComponentFactory<HTMLGlobalAttributes>;


        em: ReactComponentFactory<HTMLGlobalAttributes>;


        embed: ReactComponentFactory<EmbedAttributes>;


        fieldset: ReactComponentFactory<FieldsetAttributes>;


        figcaption: ReactComponentFactory<HTMLGlobalAttributes>;


        figure: ReactComponentFactory<HTMLGlobalAttributes>;


        footer: ReactComponentFactory<HTMLGlobalAttributes>;


        form: ReactComponentFactory<FormAttributes>;


        h1: ReactComponentFactory<HTMLGlobalAttributes>;


        h2: ReactComponentFactory<HTMLGlobalAttributes>;


        h3: ReactComponentFactory<HTMLGlobalAttributes>;


        h4: ReactComponentFactory<HTMLGlobalAttributes>;


        h5: ReactComponentFactory<HTMLGlobalAttributes>;


        h6: ReactComponentFactory<HTMLGlobalAttributes>;


        head: ReactComponentFactory<HTMLGlobalAttributes>;


        header: ReactComponentFactory<HTMLGlobalAttributes>;


        hr: ReactComponentFactory<HTMLGlobalAttributes>;


        html: ReactComponentFactory<HTMLGlobalAttributes>;


        i: ReactComponentFactory<HTMLGlobalAttributes>;


        iframe: ReactComponentFactory<IframeAttributes>;


        img: ReactComponentFactory<ImgAttributes>;


        input: ReactComponentFactory<InputAttributes>;


        ins: ReactComponentFactory<InsAttributes>;


        kbd: ReactComponentFactory<HTMLGlobalAttributes>;


        keygen: ReactComponentFactory<KeygenAttributes>;


        label: ReactComponentFactory<LabelAttributes>;


        legend: ReactComponentFactory<HTMLGlobalAttributes>;


        li: ReactComponentFactory<LiAttributes>;


        link: ReactComponentFactory<LinkAttributes>;


        main: ReactComponentFactory<HTMLGlobalAttributes>;


        map: ReactComponentFactory<MapAttributes>;


        mark: ReactComponentFactory<HTMLGlobalAttributes>;


        menu: ReactComponentFactory<MenuAttributes>;


        menuitem: ReactComponentFactory<HTMLGlobalAttributes>;


        meta: ReactComponentFactory<MetaAttributes>;


        meter: ReactComponentFactory<MeterAttributes>;


        nav: ReactComponentFactory<HTMLGlobalAttributes>;


        noscript: ReactComponentFactory<HTMLGlobalAttributes>;


        object: ReactComponentFactory<ObjectAttributes>;


        ol: ReactComponentFactory<HTMLGlobalAttributes>;


        optgroup: ReactComponentFactory<HTMLGlobalAttributes>;


        option: ReactComponentFactory<OptionAttributes>;


        output: ReactComponentFactory<OutputAttributes>;


        p: ReactComponentFactory<HTMLGlobalAttributes>;


        param: ReactComponentFactory<ParamAttributes>;


        pre: ReactComponentFactory<HTMLGlobalAttributes>;


        progress: ReactComponentFactory<ProgressAttributes>;


        q: ReactComponentFactory<HTMLGlobalAttributes>;


        rp: ReactComponentFactory<HTMLGlobalAttributes>;


        rt: ReactComponentFactory<HTMLGlobalAttributes>;


        ruby: ReactComponentFactory<HTMLGlobalAttributes>;


        s: ReactComponentFactory<HTMLGlobalAttributes>;


        samp: ReactComponentFactory<HTMLGlobalAttributes>;


        script: ReactComponentFactory<ScriptAttributes>;


        section: ReactComponentFactory<HTMLGlobalAttributes>;


        select: ReactComponentFactory<SelectAttributes>;


        small: ReactComponentFactory<HTMLGlobalAttributes>;


        source: ReactComponentFactory<SourceAttributes>;


        span: ReactComponentFactory<HTMLGlobalAttributes>;


        strong: ReactComponentFactory<HTMLGlobalAttributes>;


        style: ReactComponentFactory<StyleAttributes>;


        sub: ReactComponentFactory<HTMLGlobalAttributes>;


        summary: ReactComponentFactory<HTMLGlobalAttributes>;


        sup: ReactComponentFactory<HTMLGlobalAttributes>;


        table: ReactComponentFactory<TableAttributes>;


        tbody: ReactComponentFactory<HTMLGlobalAttributes>;


        td: ReactComponentFactory<TdAttributes>;


        textarea: ReactComponentFactory<TextareaAttributes>;


        tfoot: ReactComponentFactory<HTMLGlobalAttributes>;


        th: ReactComponentFactory<ThAttributes>;


        thead: ReactComponentFactory<HTMLGlobalAttributes>;


        time: ReactComponentFactory<TimeAttributes>;


        title: ReactComponentFactory<HTMLGlobalAttributes>;


        tr: ReactComponentFactory<HTMLGlobalAttributes>;


        track: ReactComponentFactory<TrackAttributes>;


        u: ReactComponentFactory<HTMLGlobalAttributes>;


        ul: ReactComponentFactory<HTMLGlobalAttributes>;


        var: ReactComponentFactory<HTMLGlobalAttributes>;


        video: ReactComponentFactory<VideoAttributes>;


        wbr: ReactComponentFactory<HTMLGlobalAttributes>;


        //svg elements
        circle: ReactComponentFactory<SVGAttributes>;


        g: ReactComponentFactory<SVGAttributes>;


        line: ReactComponentFactory<SVGAttributes>;


        path: ReactComponentFactory<SVGAttributes>;


        polygon: ReactComponentFactory<SVGAttributes>;


        polyline: ReactComponentFactory<SVGAttributes>;


        rect: ReactComponentFactory<SVGAttributes>;


        svg: ReactComponentFactory<SVGAttributes>;


        text: ReactComponentFactory<SVGAttributes>;

    }

}

