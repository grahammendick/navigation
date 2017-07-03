import React from 'react';
import { interpolate } from 'd3-interpolate';
import * as Easing from 'd3-ease';

class Motion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.move = this.move.bind(this);
        this.state = {items: []};
    }
    componentWillReceiveProps() {
        cancelAnimationFrame(this.moveId);
        this.moveId = requestAnimationFrame(this.move);
    }
    componentDidMount() {
        this.moveId = requestAnimationFrame(this.move)
    }
    componentWillUnmount() {
        cancelAnimationFrame(this.moveId);
    }
    move() {
        this.setState(({items: prevItems, update}) => {
            var {data, enter, leave, update, getKey, onRest} = this.props;
            var dataByKey = data.reduce((acc, item) => ({...acc, [getKey(item)]: item}), {});
            var itemsByKey = prevItems.reduce((acc, item) => ({...acc, [item.key]: item}), {});
            var tick = performance.now();
            var items = prevItems
                .map(item => {
                    var end = !dataByKey[item.key] ? leave(item.data) : update(item.data);                
                    var equal = this.areEqual(item.end, end);
                    var rest = equal ? item.progress === 1 : false;
                    var progress = equal ? Math.max(Math.min(item.progress + ((tick - item.tick) / 500), 1), 0) : 0; 
                    var interpolators = equal ? item.interpolators : this.getInterpolators(item.style, end);
                    var style = this.interpolateStyle(interpolators, end, progress);
                    if (rest && !item.rest) {
                        onRest(item.data, item.key);
                    }
                    return {key: item.key, data: item.data, style, end, interpolators, progress, tick, rest};
                })
                .filter(item => !item.rest || dataByKey[item.key])
                .concat(data
                    .filter(item => !itemsByKey[getKey(item)])
                    .map(item => {
                        var style = enter(item);
                        var end = update(item);
                        var interpolators = this.getInterpolators(style, end);
                        return {key: getKey(item), data: item, style, end, interpolators, progress: 0, tick, rest: false};
                    })
                );
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
    getInterpolators(start, end) {
        var interpolators = {};
        for(var key in start) {
            interpolators[key] = interpolate(start[key], end[key]);
        }
        return interpolators;        
    }
    interpolateStyle(interpolators, end, progress) {
        var style = {};
        for(var key in end) {
            style[key] = interpolators[key](Easing.easeLinear(progress))
        }
        return style;
    }
    render() {
        return this.props.children(this.state.items);
    }
}

export default Motion;
