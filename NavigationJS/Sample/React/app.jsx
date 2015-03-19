var List = React.createClass({
	getInitialState: function() {
		return {};
	},
  	componentDidMount: function(){
		var self = this;
		var personStates = Navigation.StateInfoConfig.dialogs.person.states;
		personStates.list.navigated = function (data) {
			var people = personSearch.search(data.name, data.sortExpression);
			self.props.totalRowCount = people.length;
			self.props.startRowIndex = data.startRowIndex;
			self.props.maximumRows = data.maximumRows;
			people = people.slice(data.startRowIndex, data.startRowIndex + data.maximumRows);
			self.props.sortExpression = data.sortExpression.indexOf('DESC') === -1 ? 'Name DESC' : 'Name';
			self.setState({ people: people });
		};
		personStates.list.dispose = function () { 
			self.setState({ people: null });
		}
	},
	render: function(){
		if (this.state.people == null)
			return null;
        var people = this.state.people.map(function (person) {
            return (
                <tr>
                    <td><NavigationLink action="select" toData={{ id: person.id }}>{person.name}</NavigationLink></td>
                    <td>{person.dateOfBirth}</td>
                </tr>
            );
        });
        return (
			<div>
				Page size&nbsp;
				<RefreshLink toData={{ maximumRows: 5, startRowIndex: null }} includeCurrentData={true}>5</RefreshLink>&nbsp;
				<RefreshLink toData={{ maximumRows: 10, startRowIndex: null }} includeCurrentData={true}>10</RefreshLink>
				<table>
					<thead>
						<tr>
							<th><RefreshLink toData={{ sortExpression: this.props.sortExpression }} includeCurrentData={true}>Name</RefreshLink></th>
							<th>Date of Birth</th>
						</tr>
					</thead>
					<tbody>{people}</tbody>
				</table>
				<Pager startRowIndex={this.props.startRowIndex} maximumRows={this.props.maximumRows} totalRowCount={this.props.totalRowCount} />
			</div>
        );
	}
});

var Pager = React.createClass({
	render: function(){
	    var remainder = this.props.totalRowCount % this.props.maximumRows;
	    var previous = this.props.startRowIndex - this.props.maximumRows;
	    var next = this.props.startRowIndex + this.props.maximumRows;
		var last = remainder != 0 ? this.props.totalRowCount - remainder : this.props.totalRowCount - this.props.maximumRows;
		return (
			<div>
				<RefreshLink toData={{ startRowIndex: 0 }} includeCurrentData={true}>First</RefreshLink>&nbsp;
				<RefreshLink toData={{ startRowIndex: previous }} includeCurrentData={true}>Previous</RefreshLink>&nbsp;
				<RefreshLink toData={{ startRowIndex: next }} includeCurrentData={true}>Next</RefreshLink>&nbsp;
				<RefreshLink toData={{ startRowIndex: last }} includeCurrentData={true}>Last</RefreshLink>
			</div>
		);
	}
});

var Details = React.createClass({
	getInitialState: function() {
		return {};
	},
  	componentDidMount: function(){
		var self = this;
		var personStates = Navigation.StateInfoConfig.dialogs.person.states;
		personStates.details.navigated = function (data) {
			self.setState({ person: {} });
		};
		personStates.details.dispose = function () { 
			self.setState({ person: null });
		}
	},
	render: function(){
		if (this.state.person == null)
			return null;
		return (
			<NavigationBackLink distance="1">Person Search</NavigationBackLink>
		);
	}
});

Navigation.StateInfoConfig.build([
	{ key: 'person', initial: 'list', states: [
		{ key: 'list', route: '{startRowIndex}/{maximumRows}/{sortExpression}', defaults: { startRowIndex: 0, maximumRows: 10, sortExpression: 'Name'}, trackCrumbTrail: false, title: 'Person Search', transitions: [
			{ key: 'select', to: 'details' }]},
		{ key: 'details', route: 'person', title: 'Person Details', }]}
]);

React.render(
	<List show={false} />,
	document.getElementById('list')
);
React.render(
	<Details show={false} />,
	document.getElementById('details')
);
Navigation.start();
