import React from 'react';
import { interpolate } from 'd3-interpolate';

class Motion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.move = this.move.bind(this);
        this.state = {items: []};
    }
    componentDidMount() {
        this.moveId = requestAnimationFrame(this.move)
    }
    componentWillUnmount() {
        cancelAnimationFrame(this.moveId);            
    }
    move() {
        this.setState(({items: prevItems, update}) => {
            var items = target(prevItems, this.props);
            // Interpolate styles
            this.moveId = requestAnimationFrame(this.move);
            return {items};
        })
    }
    target(items, {data, enter, leave}) {
        // Set destinations
        var dataByKey = data.reduce((acc, dataItem) => ({...acc, [dataItem.key]: dataItem}), {});
        var itemsByKey = items.reduce((acc, item) => ({...acc, [item.key]: item}), {});
        return items
            .map(item => {
                var end = !dataByKey[item.key] ? leave(item.data) : update(item.data);                
                const equal = areEqual(item.end, end);
                var progress = equal ? item.progress : 0;
                var interpolators = equal ? item.interpolators : this.getInterpolators(item.style, end);
                return {...item, end, interpolators, progress, tick: equal};
             })
            .concat(data
                .filter(dataItem => !itemsByKey[dataItem.key])
                .map(dataItem => {
                    var end = update(dataItem);
                    var interpolators = this.getInterpolators(enter(dataItem), end);
                    return {...dataItem, end, interpolators, progress: 0, tick: false};
                })
            );
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
}

export default Motion;
