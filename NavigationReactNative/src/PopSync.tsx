import * as React from 'react';
type PopSyncProps<T> = {data: T[], getKey: any, children: (items: {key: string, data: T}[], popped: (key: string) => void) => React.ReactElement<any>[]};

class PopSync<T> extends React.Component<PopSyncProps<T>, any> {
    constructor(props) {
        super(props);
        this.state = {items: []};
        this.popped = this.popped.bind(this);
    }
    static getDerivedStateFromProps(props, {items: prevItems}) {
        var tick = Date.now();
        var {data, getKey} = props;
        var popTime = tick + 1000;
        var dataByKey = data.reduce((acc, item, index) => ({...acc, [getKey(item)]: {...item, index}}), {});
        var itemsByKey = prevItems.reduce((acc, item) => ({...acc, [item.key]: item}), {});
        var items = prevItems
            .map(item => {
                var matchedItem = dataByKey[item.key];
                var nextItem: any = {key: item.key, data: matchedItem || item.data};
                nextItem.index = !matchedItem ? item.index : matchedItem.index;
                nextItem.popTime = !matchedItem ? (item.popTime || popTime) : undefined;
                return nextItem;
            })
            //.filter(item => !item.popTime || tick < item.popTime)
            .concat(data
                .filter(item => !itemsByKey[getKey(item)])
                .map(item => {
                    var index = dataByKey[getKey(item)].index;
                    return {key: getKey(item), data: item, index};
                })
            )
            .sort((a, b) => a.index !== b.index ? a.index - b.index : a.key.length - b.key.length);
        return {items};
    }
    popped(key: string) {
        this.setState(({items: prevItems}) => {
            var poppedItem = prevItems.filter(item => item.key === key)[0];
            if (!poppedItem)
                return null;
            var items = prevItems.filter(({popTime, index}) => (
                popTime !== poppedItem.popTime || index > poppedItem.index 
            ));
            return {items};            
        });
    }
    render() {
        return this.props.children(this.state.items, this.popped);
    }
}

export default PopSync;
