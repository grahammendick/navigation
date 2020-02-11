import React from 'react'
import { requireNativeComponent, Platform } from 'react-native';
import NavigationBar from './NavigationBar';
import SearchBar from './SearchBar';

class CoordinatorLayout extends React.Component<any, any> {
    private ref: React.RefObject<any>;
    private dragging = false;
    private y = 0;
    constructor(props) {
        super(props);
        this.ref = React.createRef<any>();
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTouchCancel = this.onTouchCancel.bind(this);
    }
    onTouchStart({nativeEvent}) {
        this.dragging = true;
        this.y = nativeEvent.locationY;
    }
    onTouchMove({nativeEvent}) {
        if (this.dragging) {
            var deltaY = nativeEvent.locationY - this.y;
        }
    }
    onTouchEnd() {
        this.dragging = false;
    }
    onTouchCancel() {        
        this.dragging = false;
    }
    render() {
        var {overlap, children} = this.props;
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
                <NVCoordinatorLayout
                    ref={this.ref}
                    overlap={overlap}
                    style={{flex: 1}}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
                    onTouchCancel={this.onTouchCancel}>
                    {clonedChildren}
                </NVCoordinatorLayout>
                {searchBar}
            </>
        );
    }
}
const NVCoordinatorLayout = requireNativeComponent<any>('NVCoordinatorLayout', null)

export default Platform.OS === 'android' ? CoordinatorLayout : ({children}) => children;

