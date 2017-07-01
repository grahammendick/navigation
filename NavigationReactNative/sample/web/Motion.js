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
            const items = target(prevItems, this.props);
            // Interpolate styles
            this.moveId = requestAnimationFrame(this.move);
            return {items};
        })
    }
    target(items, {data, enter, leave}) {
        // Set destinations
        const dataByKey = data.reduce((acc, dataItem) => ({...acc, [dataItem.key]: dataItem}), {});
        const itemsByKey = items.reduce((acc, item) => ({...acc, [item.key]: item}), {});
        return items
            .map(item => {
                const end = !dataByKey[item.key] ? leave(item.data) : update(item.data);
                return {...item, end, interpolators: this.getInterpolators(item.style, end)};
             })
            .concat(data
                .filter(dataItem => !itemsByKey[dataItem.key])
                .map(dataItem => {
                    const end = update(dataItem);
                    return {...dataItem, end, interpolators: this.getInterpolators(enter(dataItem), end)};
                })
            );
    }
    getInterpolators(start, end) {
        const interpolators = {};
        for(var key in start) {
            interpolators[key] = interpolate(start[key], end[key]);
        }
        return interpolators;        
    }
}

export default Motion;
