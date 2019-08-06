import * as React from 'react';

class Ghost extends React.Component<{getKey: any, data: any, children: any}, {items: any}> {
    constructor(props) {
        super(props);
        this.state = {items: []};
    }
    static getDerivedStateFromProps(props, {items: prevItems}) {
        var {getKey, data} = props;
        var dataByKey = data.reduce((acc, item, index) => ({...acc, [getKey(item)]: {...item, index}}), {});
        var itemsByKey = prevItems.reduce((acc, item) => ({...acc, [item.key]: item}), {});
        var items = prevItems
            .filter(item => !item.popped)
            .map(item => {
                var matchedItem = dataByKey[item.key];
                var nextItem: any = {key: item.key, data: matchedItem || item.data};
                nextItem.index = !matchedItem ? item.index : matchedItem.index;
                nextItem.popped = !matchedItem;
                return nextItem;
            })
            .filter(item => true)
            .concat(data
                .filter(item => !itemsByKey[getKey(item)])
                .map(item => {
                    var index = dataByKey[getKey(item)].index;
                    return {key: getKey(item), data: item, index, popped: false};
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
