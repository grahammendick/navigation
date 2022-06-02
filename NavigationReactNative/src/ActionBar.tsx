import React, {useState} from 'react'
import { requireNativeComponent, Platform, StyleSheet } from 'react-native';

const ActionBar = props => {
    const [bounds, setBounds] = useState({});
    return Platform.OS == 'android' ? (
        <NVActionBar
            {...props}
            onChangeBounds={({nativeEvent: {width, height}}) => {setBounds({width, height})}}
            style={[styles.actionView, bounds]} />
     ) : null;
};

const NVActionBar = global.nativeFabricUIManager ? require('./ActionBarNativeComponent').default : requireNativeComponent('NVActionBar');

const styles = StyleSheet.create({
    actionView: {
        flex: 1,
    },
});

export default ActionBar;
