import * as React from 'react';
type GhostProps<T> = {data: T[], getKey: any, nativePop: boolean, children: (items: {key: string, data: T}[]) => React.ReactElement<any>[]};

class Ghost<T> extends React.Component<GhostProps<T>, any> {
    constructor(props) {
        super(props);
        this.state = {items: []};
    }
    static getDerivedStateFromProps(props, {items: prevItems}) {
        var tick = Date.now();
        var popTime = tick + (!nativePop ? 1000 : 0);
        var {data, getKey, nativePop} = props;
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
            .filter(item => !item.popTime || tick < item.popTime)
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
    render() {
        return this.props.children(this.state.items);
    }
}

export default Ghost;
