import * as React from 'react';
import { MotionProps } from './Props';

class Motion<T> extends React.Component<MotionProps<T>, any> {
    private animateId: number;
    constructor(props) {
        super(props);
        this.animate = this.animate.bind(this);
        this.state = {items: [], restart: false};
    }
    static defaultProps = {
        progress: 0,
    }
    static getDerivedStateFromProps(props, {items: prevItems}) {
        var tick = typeof performance !== 'undefined' ? performance.now() : 0;
        var {items, moving} = Motion.move(tick, prevItems, props);
        return {items, restart: moving};
    }
    componentDidMount() {
        this.animateId = requestAnimationFrame(this.animate);
    }
    componentDidUpdate() {
        if (!this.animateId && this.state.restart)
            this.animateId = requestAnimationFrame(this.animate);
    }
    componentWillUnmount() {
        cancelAnimationFrame(this.animateId);
    }
    animate(tick) {
        this.setState(({items: prevItems}) => {
            var {items, moving} = Motion.move(tick, prevItems, this.props);
            this.animateId = null;
            if (moving)
                this.animateId = requestAnimationFrame(this.animate);
            return {items, restart: false};
        })
    }
    static move(tick, prevItems, props: MotionProps<any>) {
        var {data, enter, leave, update, progress, getKey, duration, onRest} = props;
        var dataByKey = data.reduce((acc, item, index) => ({...acc, [getKey(item)]: {...(item as any), index}}), {});
        var itemsByKey = prevItems.reduce((acc, item) => ({...acc, [item.key]: item}), {});
        var items = prevItems
            .map((item, index) => {
                var matchedItem = dataByKey[item.key];
                var nextItem: any = {key: item.key, data: matchedItem || item.data, tick};
                nextItem.end = !matchedItem ? (leave || update)(item.data) : update(matchedItem);
                nextItem.index = !matchedItem ? data.length + index : matchedItem.index;
                var unchanged = Motion.areEqual(item.end, nextItem.end);
                if (unchanged) {
                    nextItem.start = item.start;
                    nextItem.rest = item.progress === 1;
                    var progressDelta = (nextItem.tick - item.tick) / duration;
                    nextItem.progress = Math.min(item.progress + progressDelta, 1);
                } else {
                    nextItem.rest = false;
                    var reverse = !unchanged && Motion.areEqual(item.start, nextItem.end);
                    nextItem.start = reverse ? item.end : (!progress ? item.style : item.start);
                    nextItem.progress = reverse ? 1 - item.progress : progress;
                }
                nextItem.style = Motion.interpolateStyle(nextItem);
                if (onRest && nextItem.rest && !item.rest)
                    onRest(item.data);
                return nextItem;
            })
            .filter(item => dataByKey[item.key] || (!item.rest && leave))
            .concat(data
                .filter(item => !itemsByKey[getKey(item)])
                .map(item => {
                    var index = dataByKey[getKey(item)].index;
                    var newItem: any = {key: getKey(item), data: item, tick, rest: false, index};
                    newItem.start = newItem.style = enter(item);
                    newItem.end = update(item);
                    newItem.progress = Motion.areEqual(newItem.start, newItem.end) ? 1 : 0;
                    return newItem;
                })
            )
            .sort((a, b) => a.index - b.index);
        return {items, moving: items.filter(({rest}) => !rest).length !== 0};
    }
    static areEqual(from = {}, to = {}) {
        if (Object.keys(from).length !== Object.keys(to).length)
            return false;
        for(var key in from) {
            if (from[key] !== to[key])
                return false;
        }
        return true;
    }
    static interpolateStyle({start, end, progress}) {
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
