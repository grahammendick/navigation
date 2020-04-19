import React from 'react';
import BackHandlerContext from './BackHandlerContext';
import createBackHandler from './createBackHandler';

class BackHandlerScope extends React.Component<any> {
    private backHandler: any;
    constructor(props) {
        super(props);
        this.backHandler = createBackHandler();
    }
    render() {
        return (
            <BackHandlerContext.Provider value={this.backHandler}>
                {(this.props as any).children(this.backHandler.handleBack)}
            </BackHandlerContext.Provider>
        );
    }
};

export default BackHandlerScope;
