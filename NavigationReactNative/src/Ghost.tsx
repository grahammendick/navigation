import * as React from 'react';

class Ghost extends React.Component<{children: any}, {items: any}> {
    constructor(props) {
        super(props);
        this.state = {items: []};
    }
    static getDerivedStateFromProps(props, {items: prevItems}) {
        var items;
        return {items};
    }
    render() {
        return this.props.children(this.state.items);
    }
}

export default Ghost;
