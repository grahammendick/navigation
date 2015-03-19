var List = React.createClass({
	render: function(){
		if (!this.props.show)
			return null;
        var people = this.props.people.map(function (person) {
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
			</div>
        );
	}
});

var Details = React.createClass({
	render: function(){
		if (!this.props.show)
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

function renderList(show, people, sortExpression){
	React.render(
		<List show={show} people={people} sortExpression={sortExpression} />,
		document.getElementById('list')
	);
}

function renderDetails(show){
	React.render(
		<Details show={show} />,
		document.getElementById('details')
	);
}

var personStates = Navigation.StateInfoConfig.dialogs.person.states;
personStates.list.navigated = function (data) {
	var people = personSearch.search(data.name, data.sortExpression);
	people = people.slice(data.startRowIndex, data.startRowIndex + data.maximumRows);
	var sortExpression = data.sortExpression.indexOf('DESC') === -1 ? 'Name DESC' : 'Name';
	renderList(true, people, sortExpression)
};
personStates.list.dispose = function () { 
	renderList(false)
}
personStates.details.navigated = function (data) {
	renderDetails(true);
};
personStates.details.dispose = function () { 
	renderDetails(false);
}
Navigation.start();
