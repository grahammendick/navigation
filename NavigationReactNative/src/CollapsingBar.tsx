import React from 'react';
import { requireNativeComponent, Platform } from 'react-native';

var CollapsingBar: any = ({largeTitle = false, barTintColor, titleColor, largeTitleColor, style = {}, ...props}) => (
    <NVCollapsingBar
        titleEnabled={largeTitle}
        contentScrimColor={barTintColor}
        collapsedTitleColor={titleColor}
        expandedTitleColor={largeTitleColor}
        style={{backgroundColor: style.backgroundColor}}
        {...props} />
)

var NVCollapsingBar = requireNativeComponent<any>('NVCollapsingBar', null);

export default Platform.OS === "android" ? CollapsingBar : () => null;
