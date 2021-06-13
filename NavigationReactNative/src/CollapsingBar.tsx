import React from 'react';
import { requireNativeComponent, Platform } from 'react-native';

var CollapsingBar: any = ({largeTitle = false, largeBarTintColor, titleColor, largeTitleColor,
    largeTitleFontFamily, largeTitleFontWeight, largeTitleFontStyle, style, ...props}) => (
    <NVCollapsingBar
        titleEnabled={largeTitle}
        contentScrimColor={largeBarTintColor}
        collapsedTitleColor={titleColor}
        expandedTitleColor={largeTitleColor}
        titleFontFamily={largeTitleFontFamily}
        titleFontWeight={largeTitleFontWeight}
        titleFontStyle={largeTitleFontStyle}
        {...props} />
)

var NVCollapsingBar = requireNativeComponent<any>('NVCollapsingBar', null);

export default Platform.OS === "android" ? CollapsingBar : () => null;
