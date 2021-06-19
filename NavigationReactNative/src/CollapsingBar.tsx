import React from 'react';
import { requireNativeComponent, Platform } from 'react-native';

var CollapsingBar: any = ({largeTitle = false, title, barTintColor, titleColor, largeTitleColor, titleFontFamily,
    titleFontWeight, titleFontStyle, largeTitleFontFamily, largeTitleFontWeight, largeTitleFontStyle, children}) => (
    <NVCollapsingBar
        title={title}
        titleEnabled={largeTitle}
        contentScrimColor={barTintColor}
        collapsedTitleColor={titleColor}
        expandedTitleColor={largeTitleColor}
        titleFontFamily={titleFontFamily}
        titleFontWeight={titleFontWeight}
        titleFontStyle={titleFontStyle}
        largeTitleFontFamily={largeTitleFontFamily}
        largeTitleFontWeight={largeTitleFontWeight}
        largeTitleFontStyle={largeTitleFontStyle}>
        {children}
    </NVCollapsingBar>
)

var NVCollapsingBar = requireNativeComponent<any>('NVCollapsingBar', null);

export default Platform.OS === "android" ? CollapsingBar : () => null;
