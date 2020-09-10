import React from 'react';
import { requireNativeComponent, Image, Platform, StyleSheet } from 'react-native';
import BackButton from './BackButton';
import BackHandlerContext from './BackHandlerContext';
import createBackHandler from './createBackHandler';

class TabBarItem extends React.Component<any> {
    private backHandler: any;
    constructor(props) {
        super(props);
        this.handleBack = this.handleBack.bind(this);
        this.backHandler = createBackHandler();
    }
    handleBack() {
        return this.props.selected && this.backHandler.handleBack();
    }
    render() {
        var {onPress, children, image, systemItem, badge, index, ...props} = this.props;
        image = typeof image === 'string' ? (Platform.OS === 'ios' ? null : {uri: image}) : image;
        return (
            <NVTabBarItem
                {...props}
                badge={badge != null ? (Platform.OS === 'ios' ? '' + badge : +badge) : undefined}
                image={Platform.OS === 'ios' ? image : Image.resolveAssetSource(image)}
                systemItem={systemItem || ''}
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
