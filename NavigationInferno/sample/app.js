var createElement = InfernoCreateElement;

class List extends InfernoComponent {
    shouldComponentUpdate(nextProps) {
        return nextProps.startRowIndex !== this.props.startRowIndex || nextProps.maximumRows !== this.props.maximumRows
            || nextProps.sortExpression !== this.props.sortExpression || nextProps.name !== this.props.name;
    }
    render() {
        var people = personSearch.search(this.props.name, this.props.sortExpression);
        var totalRowCount = people.length;
        people = people.slice(this.props.startRowIndex, this.props.startRowIndex + this.props.maximumRows);
        var sortExpression = this.props.sortExpression.indexOf('DESC') === -1 ? 'Name DESC' : 'Name';
        var stateNavigator = this.props.stateNavigator;
        people = people.map(function (person) {
            return (
                createElement('tr', {key: person.id}, [
                    createElement('td', null,
                        createElement(NavigationInferno.NavigationLink, {
                            stateNavigator: stateNavigator,
                            stateKey: "person",
                            navigationData: { id: person.id }
                        }, person.name)
                    ), 
                    createElement('td', null, person.dateOfBirth)
                ])
            );
        });
        return (
            createElement('div', null, [
                createElement(Filter, {
                    stateNavigator: this.props.stateNavigator,
                    initialName: this.props.name
                }),
                createElement('table', null, [
                    createElement('thead', null,
                        createElement('tr', null, [
                            createElement('th', null, 
                                createElement(NavigationInferno.RefreshLink, {
                                    stateNavigator: this.props.stateNavigator,
                                    navigationData: { sortExpression: sortExpression },
                                    includeCurrentData: true
                                }, 'Name')
                            ),
                            createElement('th', null, 'Date of Birth')
                        ]) 
                    ),
                    createElement('tbody', null, people)
                ]),
                createElement(Pager, {
                    stateNavigator: this.props.stateNavigator,
                    startRowIndex: this.props.startRowIndex,
                    maximumRows: this.props.maximumRows,
                    totalRowCount:totalRowCount
                })
            ])
        );
    }
};

class Filter extends InfernoComponent {
    constructor(props){
        super(props);
        this.nameChange = this.nameChange.bind(this);
        this.nameBlur = this.nameBlur.bind(this);
        this.state = {
            name: this.props.initialName
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ name: nextProps.initialName });
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.name !== this.state.name;
    } 
    nameChange(event) {
        this.setState({name: event.target.value});
    }
    nameBlur(event) {
        this.props.stateNavigator.refresh(this.props.stateNavigator.stateContext.includeCurrentData({ name: event.target.value, startRowIndex: null }));
    }
    render() {
        return (
            createElement('div', null, [
                createElement('div', null, [
                    createElement('label', {
                        for: 'name'
                    }, 'Name'),
                    createElement('input', {
                        id: "name",
                        value: this.state.name ? this.state.name: null,
                        onChange: this.nameChange,
                        onBlur: this.nameBlur
                    })
                ]),
                'Page Size ',
                createElement(NavigationInferno.RefreshLink, {
                    stateNavigator: this.props.stateNavigator,
                    navigationData: { maximumRows: 5, startRowIndex: null },
                    includeCurrentData: true,
                    activeCssClass: 'active'
                }, '5'),
                ' ',
                createElement(NavigationInferno.RefreshLink, {
                    stateNavigator: this.props.stateNavigator,
                    navigationData: { maximumRows: 10, startRowIndex: null },
                    includeCurrentData: true,
                    activeCssClass: 'active'
                }, '10')
            ])
        );
    }
};

class Pager extends InfernoComponent {
    shouldComponentUpdate(nextProps) {
        return nextProps.startRowIndex !== this.props.startRowIndex || nextProps.maximumRows !== this.props.maximumRows
            || nextProps.totalRowCount !== this.props.totalRowCount;
    }
    render() {
        var remainder = this.props.totalRowCount % this.props.maximumRows;
        var previous = Math.max(0, this.props.startRowIndex - this.props.maximumRows);
        var next = this.props.startRowIndex + this.props.maximumRows;
        var last = remainder != 0 ? this.props.totalRowCount - remainder : this.props.totalRowCount - this.props.maximumRows;
        if (next >= this.props.totalRowCount)
            next = last = this.props.startRowIndex;
        return (
            createElement('div', null, [
                createElement('ul', null, [
                    createElement('li', null, 
                        createElement(NavigationInferno.RefreshLink, {
                            stateNavigator: this.props.stateNavigator,
                            navigationData: { startRowIndex: 0 },
                            includeCurrentData: true,
                            disableActive: true
                        }, 'First')
                    ),
                    createElement('li', null, 
                        createElement(NavigationInferno.RefreshLink, {
                            stateNavigator: this.props.stateNavigator,
                            navigationData: { startRowIndex: previous },
                            includeCurrentData: true,
                            disableActive: true
                        }, 'Previous')
                    ),
                    createElement('li', null, 
                        createElement(NavigationInferno.RefreshLink, {
                            stateNavigator: this.props.stateNavigator,
                            navigationData: { startRowIndex: next },
                            includeCurrentData: true,
                            disableActive: true
                        }, 'Next')
                    ),
                    createElement('li', null, 
                        createElement(NavigationInferno.RefreshLink, {
                            stateNavigator: this.props.stateNavigator,
                            navigationData: { startRowIndex: last },
                            includeCurrentData: true,
                            disableActive: true
                        }, 'Last')
                    )
                ]),
                'Total Count ' + this.props.totalRowCount
            ])
        );
    }
};

class Details extends InfernoComponent {
    shouldComponentUpdate(nextProps) {
        return nextProps.id !== this.props.id;
    }
    render() {
        var person = personSearch.getDetails(this.props.id);
        return (
            createElement('div', null, [
                createElement(NavigationInferno.NavigationBackLink, {
                    stateNavigator: this.props.stateNavigator,
                    distance: 1
                }, 'Person Search'),
                createElement('div', null, [
                    'Name: ' + person.name,
                    createElement('br'),
                    'Date of Birth: ' + person.dateOfBirth
                ])
            ])
        );
    }
};

var stateNavigator = new Navigation.StateNavigator([
    { key: 'people', route: '{startRowIndex?}/{maximumRows?}/{sortExpression?}', defaults: { startRowIndex: 0, maximumRows: 10, sortExpression: 'Name'}, trackTypes: false, title: 'Person Search' },
    { key: 'person', route: 'person', defaultTypes: { id: 'number' }, trackTypes: false, trackCrumbTrail: true, title: 'Person Details' }
]);

var states = stateNavigator.states;
states.people.navigated = function (data) {
    InfernoDOM.render(
        createElement(List, {
            stateNavigator: stateNavigator, 
            name: data.name,
            startRowIndex: data.startRowIndex,
            maximumRows: data.maximumRows,
            sortExpression: data.sortExpression
        }),
        document.getElementById('content')
    );
};
states.person.navigated = function (data) {
    InfernoDOM.render(
        createElement(Details, {
            stateNavigator: stateNavigator,
            id: data.id
        }),
        document.getElementById('content')
    );
}
stateNavigator.start();
