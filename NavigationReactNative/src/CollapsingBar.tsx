import React from 'react';
import { requireNativeComponent, Platform } from 'react-native';

var CollapsingBar: any = ({largeTitle = false, barTintColor, titleColor, largeTitleColor, style, ...props}) => (
    <NVCollapsingBar
        titleEnabled={largeTitle}
        contentScrimColor={barTintColor}
        collapsedTitleColor={titleColor}
        expandedTitleColor={largeTitleColor}
        {...props} />
)

var NVCollapsingBar = global.nativeFabricUIManager ? require('./CollapsingBarNativeComponent').default : requireNativeComponent('NVCollapsingBar');

export default Platform.OS === "android" ? CollapsingBar : () => null;
