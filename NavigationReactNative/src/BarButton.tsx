import React, { ReactElement } from 'react';
import { requireNativeComponent, Image, Platform, UIManager, StyleSheet } from 'react-native';
import ActionBar from './ActionBar';

const BarButton = React.forwardRef<any, any>(({image, systemItem, show, search, style, children, testID, ...props}, ref) => {
    var constants = (UIManager as any).getViewManagerConfig('NVNavigationBar').Constants;
    var actionBar = !!((React.Children.toArray(children) as ReactElement<any>[])[0]?.type === ActionBar);
    return (Platform.OS === 'android' || !search) && (
        <NVBarButton
            ref={ref}
            key={Platform.OS === 'ios' ? systemItem : testID}
            testID={testID}
            search={search}
            showActionView={!!children}
            showAsAction={Platform.OS === 'android' ? constants.ShowAsAction[show] : null}
            actionBar={actionBar}
            image={Image.resolveAssetSource(image)}
            systemItem={systemItem || ''}
            style={actionBar ? styles.actionBar : [styles.actionView, style]}
            children={children}
            {...props} />
    )
})

const NVBarButton = requireNativeComponent<any>('NVBarButton', null)

const styles = StyleSheet.create({
    actionBar: {
        position: 'absolute',
        ...Platform.select({
            android: {
                top: 0, right: 0,
                bottom: 0, left: 0,
            },
        })
    },
    actionView: {
        position: 'absolute',
        flex: 1,
        justifyContent:'center',
        alignItems: 'center',
        ...Platform.select({
            android: {
                width: 48,
                height: 56,
            },
        })
    }
});

export default BarButton;
