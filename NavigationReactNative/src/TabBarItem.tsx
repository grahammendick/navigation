import React from 'react';
import { requireNativeComponent, Image, Platform, StyleSheet } from 'react-native';
import BackButton from './BackButton';
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

class TabBarItem extends React.Component<any> {
    private backHandler: any;
    constructor(props) {
        super(props);
        this.handleBack = this.handleBack.bind(this);
        this.backHandler = createBackHandler();
    }
    handleBack() {
        if (this.props.selected) {
            var {listeners} = this.backHandler;
            for (var i = listeners.length - 1; i >= 0; i--) {
                if (listeners[i]())
                    return true;
            }
        }
        return false;
    }
    render() {
        var {onPress, children, image, ...props} = this.props;
        image = typeof image === 'string' ? (Platform.OS === 'ios' ? null : {uri: image}) : image;
        return (
            <NVTabBarItem
                {...props}
                image={Platform.OS === 'ios' ? image : Image.resolveAssetSource(image)}
                style={styles.tabBarItem}
                onPress={event => {
                    event.stopPropagation();
                    if (onPress)
                        onPress(event);
                }}>
                <BackButton onPress={this.handleBack} />
                <BackHandlerContext.Provider value={this.backHandler}>
                    {children}
                </BackHandlerContext.Provider>
            </NVTabBarItem>
        );
    }
};

var NVTabBarItem = requireNativeComponent<any>('NVTabBarItem', null);

const styles = StyleSheet.create({
    tabBarItem: {
        position: 'absolute',
        top: 0, right: 0,
        bottom: 0, left: 0,
    },
});

export default TabBarItem;
