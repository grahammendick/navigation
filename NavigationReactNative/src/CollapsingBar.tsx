import React from 'react';
import { requireNativeComponent, Platform } from 'react-native';

var CollapsingBar: any = ({titleEnabled = true, style = {}, ...props}) => (
    <NVCollapsingBar
        titleEnabled={titleEnabled}
        style={{backgroundColor: style.backgroundColor}}
        {...props} />
)

var NVCollapsingBar = requireNativeComponent<any>('NVCollapsingBar', null);

export default Platform.OS === "android" ? CollapsingBar : () => null;
