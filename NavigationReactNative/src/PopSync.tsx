import * as React from 'react';
import { Platform } from 'react-native';
type PopSyncProps<T> = {data: T[], getKey: any, children: (items: {key: string, data: T}[], popNative: (key: string) => void) => React.ReactElement<any>[]};

class PopSync<T> extends React.Component<PopSyncProps<T>, any> {
    constructor(props) {
        super(props);
        this.state = {items: [], data: null};
        this.popNative = this.popNative.bind(this);
    }
    static getDerivedStateFromProps(props, {items: prevItems, data: prevData}) {
        var {data, getKey} = props;
        if (data === prevData)
            return null;
        var dataByKey = data.reduce((acc, item, index) => ({...acc, [getKey(item)]: {...item, index}}), {});
        var itemsByKey = prevItems.reduce((acc, item) => ({...acc, [item.key]: item}), {});
        var items = prevItems
            .map(item => {
                var matchedItem = dataByKey[item.key];
                var nextItem: any = {key: item.key, data: matchedItem || item.data, reactPop: !matchedItem};
                nextItem.index = !matchedItem ? item.index : matchedItem.index;
                return nextItem;
            })
            .concat(data
                .filter(item => !itemsByKey[getKey(item)])
                .map(item => {
                    var index = dataByKey[getKey(item)].index;
                    return {key: getKey(item), data: item, index, reactPop: false};
                })
            )
            .sort((a, b) => a.index !== b.index ? a.index - b.index : a.key.length - b.key.length);
        return {items, data};
    }
    popNative(key: string) {
        this.setState(({items: prevItems}) => {
            var poppedItem = prevItems.filter(item => item.key === key)[0];
            if (Platform.OS === 'android' && !poppedItem.reactPop)
                return null;
            var items = prevItems.filter(item => item.key !== key);
            return {items};            
        });
    }
    render() {
        return this.props.children(this.state.items, this.popNative);
    }
}

export default PopSync;
