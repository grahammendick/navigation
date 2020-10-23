import React from 'react';
import { requireNativeComponent, Image, Platform, UIManager, StyleSheet } from 'react-native';

const BarButton = React.forwardRef<any, any>(({image, systemItem, show, search, style, children, ...props}, ref) => {
    var constants = (UIManager as any).getViewManagerConfig('NVNavigationBar').Constants;
    return (Platform.OS === 'android' || !search) && (
        <NVBarButton
            ref={ref}
            key={(Platform.OS === 'ios' && systemItem) || undefined}
            search={search}
            showActionView={!!children}
            showAsAction={Platform.OS === 'android' ? constants.ShowAsAction[show] : null}
            image={Image.resolveAssetSource(image)}
            systemItem={systemItem || ''}
            style={styles.actionView}
            children={children}
            {...props} />
    )
})

const NVBarButton = requireNativeComponent<any>('NVBarButton', null)

const styles = StyleSheet.create({
    actionView: {
        ...Platform.select({
            android: {
                position: 'absolute',
                top: 0, right: 0,
                bottom: 0, left: 0,
            },
        })
    }
});

export default BarButton;
