import React from 'react';

class Motion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.move = this.move.bind(this);
        this.state = {items: {}, update: true};
    }
    componentWillReceiveProps() {
        this.setState({update: true})
    }
    componentDidMount() {
        this.moveId = requestAnimationFrame(this.move)
    }
    componentWillUnmount() {
        cancelAnimationFrame(this.moveId);            
    }
    move() {
        this.setState(({items: prevItems, update}) => {
            const items = update ? target(prevItems, this.props) : prevItems;
            // Interpolate styles
            this.moveId = requestAnimationFrame(this.move);
            return {items, update: false};
        })
    }
    target(items, {data, enter, leave}) {
        // Set destinations
        const dataByKey = data.reduce((acc, dataItem) => ({...acc, [dataItem.key]: dataItem}), {});
        const itemsByKey = items.reduce((acc, item) => ({...acc, [item.key]: item}), {});
        return items
            .map(item => ({...item, style: !dataByKey[item.key] ? leave(item.data) : update(item.data)}))
            .concat(data
                .filter(dataItem => !itemsByKey[dataItem.key])
                .map(dataItem => ({...dataItem, style: enter(dataItem)}))
            );
    }
}

export default Motion;
