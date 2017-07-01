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
            return {items, update: false};
        })
        this.moveId = requestAnimationFrame(this.move);
    }
    target(items, props) {
        // Set destinations
    }
}

export default Motion;
