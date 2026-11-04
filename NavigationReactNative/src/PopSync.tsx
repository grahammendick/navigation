import * as React from 'react';
import { Platform } from 'react-native';
type PopSyncProps<T> = {data: T[], getKey: any, children: (items: {key: string, data: T}[], popNative: (key: string) => void) => React.ReactElement<any>[]};

class PopSync<T> extends React.Component<PopSyncProps<T>, any> {
    constructor(props) {
        super(props);
        this.state = {items: [], data: null, nativePopped: {}};
        this.popNative = this.popNative.bind(this);
    }
    static getDerivedStateFromProps(props, {items: prevItems, data: prevData, nativePopped}) {
        var {data, getKey} = props;
        if (data === prevData)
            return null;
        var dataByKey = data.reduce((acc, item, index) => ({...acc, [getKey(item)]: {...item, index}}), {});
        var itemsByKey = prevItems.reduce((acc, item) => ({...acc, [item.key]: item}), {});
        var items = prevItems
            .filter(item => dataByKey[item.key] || !nativePopped[item.key])
            .map(item => {
                var matchedItem = dataByKey[item.key];
                var nextItem: any = {key: item.key, data: matchedItem || item.data};
                nextItem.index = !matchedItem ? item.index : matchedItem.index;
                return nextItem;
            })
            .concat(data
                .filter(item => !itemsByKey[getKey(item)])
                .map(item => {
                    var index = dataByKey[getKey(item)].index;
                    return {key: getKey(item), data: item, index};
                })
            )
            .sort((a, b) => a.index - b.index);
        nativePopped = Object.keys(nativePopped).reduce((acc, key) => dataByKey[key] ? {...acc, [key]: true} : acc, {});
        return {items, data, nativePopped};
    }
    popNative(key: string) {
        this.setState(({items: prevItems, data, nativePopped}) => {
            if (data.some(item => this.props.getKey(item) === key))
                return {nativePopped: {...nativePopped, [key]: true}};
            var items = prevItems.filter(item => item.key !== key);
            return {items};
        });
    }
    render() {
        return this.props.children(this.state.items, this.popNative);
    }
}

export default PopSync;
