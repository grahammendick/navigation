var createBackHandler = () => {
    var listeners = [];
    var addEventListener = (eventName, handler) => {
        if (listeners.indexOf(handler) === -1)
            listeners.push(handler);
        return { remove: () => removeEventListener(eventName, handler) };
    }
    var removeEventListener = (_, handler) => {
        if (listeners.indexOf(handler) !== -1)
            listeners.splice(listeners.indexOf(handler), 1);
    }
    var handleBack = () => {
        for (var i = listeners.length - 1; i >= 0; i--) {
            if (listeners[i]())
                return true;
        }
        return false;
    }
    return {addEventListener, removeEventListener, handleBack, exitApp: () => {}};
}

export default createBackHandler;
