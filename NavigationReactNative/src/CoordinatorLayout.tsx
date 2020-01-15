import React from 'react'
import { requireNativeComponent, Platform } from 'react-native';
import NavigationBar from './NavigationBar';
import SearchBar from './SearchBar';

const CoordinatorLayout = ({children}) => {
    var {clonedChildren, searchBar} = React.Children.toArray(children)
        .reduce((val, child: any) => {
            if (child.type === NavigationBar) {
                var barChildren = React.Children.toArray(child.props.children);
                val.searchBar = barChildren.find(({type}: any) => type === SearchBar);
                child = React.cloneElement(child, child.props, barChildren.filter(c => c !== val.searchBar))
            }
            val.clonedChildren.push(child);
            return val;
        }, {clonedChildren: [], searchBar: null});
    return (
        <>
            <NVCoordinatorLayout style={{flex: 1}}>{clonedChildren}</NVCoordinatorLayout>
            {searchBar}
        </>
    );
};

const NVCoordinatorLayout = requireNativeComponent<any>('NVCoordinatorLayout', null)

export default CoordinatorLayout;

