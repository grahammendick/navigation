import * as React from 'react';
import { MotionProps } from './Props';

class Motion<T> extends React.Component<MotionProps<T>, any> {
    private moveId: number;
    constructor(props, context) {
        super(props, context);
        this.move = this.move.bind(this);
        var {data, enter, getKey} = this.props;
        var items = data.map(item => {
            var newItem: any = {key: getKey(item), data: item, progress: 1, tick: 0};
            newItem.start = newItem.end = newItem.style = enter(item);
            return newItem;
        });
        this.state = {items};
    }
    static defaultProps = {
        progress: 0,
    }
    componentWillReceiveProps() {
        if (!this.moveId)
            this.moveId = requestAnimationFrame(this.move);
    }
    componentDidMount() {
        this.moveId = requestAnimationFrame(this.move)
    }
    componentWillUnmount() {
        cancelAnimationFrame(this.moveId);
    }
    move(tick) {
        this.setState(({items: prevItems}) => {
            var {data, enter, leave, update, progress, getKey, duration, onRest} = this.props;
            var dataByKey = data.reduce((acc, item, index) => ({...acc, [getKey(item)]: {...(item as any), index}}), {});
            var itemsByKey = prevItems.reduce((acc, item) => ({...acc, [item.key]: item}), {});
            var items = prevItems
                .map((item, index) => {
                    var matchedItem = dataByKey[item.key];
                    var nextItem: any = {key: item.key, data: matchedItem || item.data, tick};
                    nextItem.end = !matchedItem ? (leave || update)(item.data) : update(matchedItem);
                    nextItem.index = !matchedItem ? data.length + index : matchedItem.index;
                    var unchanged = this.areEqual(item.end, nextItem.end);
                    if (unchanged) {
                        nextItem.start = item.start;
                        nextItem.rest = item.progress === 1;
                        var progressDelta = (nextItem.tick - item.tick) / duration;
                        nextItem.progress = Math.min(item.progress + progressDelta, 1);
                    } else {
                        nextItem.rest = false;
                        var reverse = !unchanged && this.areEqual(item.start, nextItem.end);
                        nextItem.start = reverse ? item.end : (!progress ? item.style : item.start);
                        nextItem.progress = reverse ? 1 - item.progress : progress;
                    }
                    nextItem.style = this.interpolateStyle(nextItem);
                    if (onRest && nextItem.rest && !item.rest)
                        onRest(item.data);
                    return nextItem;
                })
                .filter(item => dataByKey[item.key] || (!item.rest && leave))
                .concat(data
                    .filter(item => !itemsByKey[getKey(item)])
                    .map(item => {
                        var index = dataByKey[getKey(item)].index;
                        var newItem: any = {key: getKey(item), data: item, progress, tick, rest: false, index};
                        newItem.start = newItem.style = enter(item);
                        newItem.end = update(item);
                        return newItem;
                    })
                )
                .sort((a, b) => a.index - b.index);
            this.moveId = null;
            if (items.filter(({rest}) => !rest).length !== 0)
                this.moveId = requestAnimationFrame(this.move);
            return {items};
        })
    }
    areEqual(from = {}, to = {}) {
        if (Object.keys(from).length !== Object.keys(to).length)
            return false;
        for(var key in from) {
            if (from[key] !== to[key])
                return false;
        }
        return true;
    }
    interpolateStyle({start, end, progress}) {
        var style = {};
        for(var key in end)
            style[key] = start[key] + (progress * (end[key] - start[key]));
        return style;
    }
    render() {
        return this.props.children(this.state.items);
    }
}

export default Motion;
