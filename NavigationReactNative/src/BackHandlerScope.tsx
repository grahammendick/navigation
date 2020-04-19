import React from 'react';
import BackHandlerContext from './BackHandlerContext';

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
    return {listeners, addEventListener, removeEventListener};
}

class BackHandlerScope extends React.Component<any> {
    private backHandler: any;
    constructor(props) {
        super(props);
        this.handleBack = this.handleBack.bind(this);
        this.backHandler = createBackHandler();
    }
    handleBack() {
        var {listeners} = this.backHandler;
        for (var i = listeners.length - 1; i >= 0; i--) {
            if (listeners[i]())
                return true;
        }
        return false;
    }
    render() {
        return (
            <BackHandlerContext.Provider value={this.backHandler}>
                {(this.props as any).children(this.handleBack)}
            </BackHandlerContext.Provider>
        );
    }
};

export default BackHandlerScope;
