import * as React from 'react';
import { interpolate } from 'd3-interpolate';
import * as Easing from 'd3-ease';

class Motion extends React.Component<any, any> {
    private moveId: number;
    constructor(props, context) {
        super(props, context);
        this.move = this.move.bind(this);
        this.state = {items: []};
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
            var {data, enter, leave, update, getKey, duration, easing, onRest} = this.props;
            var dataByKey = data.reduce((acc, item) => ({...acc, [getKey(item)]: item}), {});
            var itemsByKey = prevItems.reduce((acc, item) => ({...acc, [item.key]: item}), {});
            var items = prevItems
                .map(item => {
                    var nextItem: any = {key: item.key, data: item.data, tick};
                    nextItem.end = !dataByKey[item.key] ? leave(item.data) : update(dataByKey[item.key]);
                    var unchanged = this.areEqual(item.end, nextItem.end);
                    if (unchanged) {
                        nextItem.start = item.start;
                        nextItem.rest = item.progress === 1;
                        var progressDelta = (nextItem.tick - item.tick) / duration(item.data);
                        nextItem.progress = Math.min(item.progress + progressDelta, 1);
                        nextItem.interpolators = item.interpolators;
                    } else {
                        nextItem.rest = false;
                        var reverse = !unchanged && this.areEqual(item.start, nextItem.end);
                        nextItem.start = reverse ? item.end : item.style;
                        nextItem.progress = reverse ? 1 - item.progress : 0;
                        nextItem.interpolators = this.getInterpolators(nextItem);
                    }
                    nextItem.style = this.interpolateStyle(nextItem, easing(item.data));
                    if (onRest && nextItem.rest && !item.rest)
                        onRest(item.data);
                    return nextItem;
                })
                .filter(item => !item.rest || dataByKey[item.key])
                .concat(data
                    .filter(item => !itemsByKey[getKey(item)])
                    .map(item => {
                        var newItem: any = {key: getKey(item), data: item, progress: 0, tick, rest: false};
                        newItem.start = newItem.style = enter(item);
                        newItem.end = update(item);
                        newItem.interpolators = this.getInterpolators(newItem);
                        return newItem;
                    })
                );
            this.moveId = null;
            if (items.filter(({rest}) => !rest).length !== 0)
                this.moveId = requestAnimationFrame(this.move);
            return {items};
        })
    }
    areEqual(from, to) {
        if (Object.keys(from).length !== Object.keys(to).length)
            return false;
        for(var key in from) {
            if (from[key] !== to[key])
                return false;
        }
        return true;
    }
    getInterpolators({start, end}) {
        var interpolators = {};
        for(var key in start)
            interpolators[key] = interpolate(start[key], end[key]);
        return interpolators;
    }
    interpolateStyle({interpolators, end, progress}, easing) {
        var style = {};
        for(var key in end)
            style[key] = interpolators[key](Easing[easing](progress))
        return style;
    }
    render() {
        return this.props.children(this.state.items);
    }
}

export default Motion;
