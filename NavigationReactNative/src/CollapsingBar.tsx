import React from 'react';
import { requireNativeComponent, Platform } from 'react-native';

var CollapsingBar: any = ({largeTitle = false, title, barTintColor, titleColor, largeTitleColor,
    largeTitleFontFamily, largeTitleFontWeight, largeTitleFontStyle, children}) => (
    <NVCollapsingBar
        title={title}
        titleEnabled={largeTitle}
        contentScrimColor={barTintColor}
        collapsedTitleColor={titleColor}
        expandedTitleColor={largeTitleColor}
        titleFontFamily={largeTitleFontFamily}
        titleFontWeight={largeTitleFontWeight}
        titleFontStyle={largeTitleFontStyle}>
        {children}
    </NVCollapsingBar>
)

var NVCollapsingBar = requireNativeComponent<any>('NVCollapsingBar', null);

export default Platform.OS === "android" ? CollapsingBar : () => null;
