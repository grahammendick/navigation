import React from 'react';
import { Platform } from 'react-native';
import BackHandlerContext from './BackHandlerContext';
import createBackHandler from './createBackHandler';

class ModalBackHandler extends React.Component<any> {
    private backHandler: any;
    constructor(props) {
        super(props);
        this.handleBack = this.handleBack.bind(this);
        this.backHandler = createBackHandler();
    }
    handleBack() {
        return Platform.OS === "android" && this.backHandler.handleBack();
    }
    render() {
        return (
            <BackHandlerContext.Provider value={this.backHandler}>
                {(this.props as any).children(this.handleBack)}
            </BackHandlerContext.Provider>
        );
    }
};

export default ModalBackHandler;
