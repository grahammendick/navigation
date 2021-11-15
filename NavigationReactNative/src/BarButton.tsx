import React, { ReactElement } from 'react';
import { requireNativeComponent, Image, Platform, UIManager } from 'react-native';
import ActionBar from './ActionBar';

const BarButton = React.forwardRef<any, any>(({image, systemItem, show, search, size = 48, style, children, testID, ...props}, ref) => {
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
            style={{position: 'absolute', width: actionBar ? undefined : size}}
            children={children}
            {...props} />
    )
})

const NVBarButton = requireNativeComponent<any>('NVBarButton', null)

export default BarButton;
