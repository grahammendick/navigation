import React from 'react';
import { requireNativeComponent, Platform } from 'react-native';

var CollapsingBar: any = ({largeTitle = false, title, largeBarTintColor, titleColor, largeTitleColor,
    largeTitleFontFamily, largeTitleFontWeight, largeTitleFontStyle}) => (
    <NVCollapsingBar
        title={title}
        titleEnabled={largeTitle}
        contentScrimColor={largeBarTintColor}
        collapsedTitleColor={titleColor}
        expandedTitleColor={largeTitleColor}
        titleFontFamily={largeTitleFontFamily}
        titleFontWeight={largeTitleFontWeight}
        titleFontStyle={largeTitleFontStyle} />
)

var NVCollapsingBar = requireNativeComponent<any>('NVCollapsingBar', null);

export default Platform.OS === "android" ? CollapsingBar : () => null;
