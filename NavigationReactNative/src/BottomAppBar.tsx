import React, { cloneElement, ReactElement } from 'react';
import { Platform, Image, StyleSheet, requireNativeComponent } from 'react-native';
import SearchBar from './SearchBar';

const BottomAppBar = ({ navigationImage, overflowImage, children, style, ...props }: any) => {
    if (Platform.OS === 'ios') return null;
    var childrenArray = (React.Children.toArray(children) as ReactElement<any>[]);
    var searchBar: any = childrenArray.find(({type}) => type === SearchBar);
    searchBar = searchBar && cloneElement(searchBar, { bottomBar: true });
    return (
        <>
            <NVBottomAppBar
                navigationImage={Image.resolveAssetSource(navigationImage)}
                overflowImage={Image.resolveAssetSource(overflowImage)}
                barHeight={56}
                style={styles.toolbar}
                {...props}>
                {childrenArray.filter(({type}) => type !== SearchBar)}
            </NVBottomAppBar>
            {searchBar}
        </>
    );
}

var NVBottomAppBar = global.nativeFabricUIManager ? require('./BottomAppBarNativeComponent').default : requireNativeComponent('NVBottomAppBar');

const styles = StyleSheet.create({
    toolbar: {
        height: 56
    },
});

export default BottomAppBar;
