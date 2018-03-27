class EventHandlerCache<Handler> {
    private name: string;
    private handlerId = 1;
    handlers: { [index: string]: Handler } = {};
    constructor(name: string) {
        this.name = name;
    }

    onEvent(handler: Handler) {
        if (!handler[this.name]) {
            var id = this.name + this.handlerId++;
            handler[this.name] = id;
            this.handlers[id] = handler;
        } else {
            throw new Error('Cannot add the same handler more than once');
        }
    }

    offEvent(handler: Handler) {
        delete this.handlers[handler[this.name]];
        delete handler[this.name];
    }
}
export default EventHandlerCache;
