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
            <table>
                <thead>
					<tr>
						<th>Name</th>
						<th>Date of Birth</th>
					</tr>
				</thead>
                <tbody>{people}</tbody>
            </table>
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

function renderList(show, people){
	React.render(
		<List show={show} people={people} />,
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
	renderList(true, people)
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
