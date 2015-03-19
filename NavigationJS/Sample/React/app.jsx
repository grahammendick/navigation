var List = React.createClass({
	render: function(){
		if (!this.props.show)
			return null;
        var people = this.props.people.map(function (person) {
            return (
                <tr>
                    <td>{person.name}</td>
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

Navigation.StateInfoConfig.build([
	{ key: 'person', initial: 'list', states: [
		{ key: 'list', route: '{startRowIndex}/{maximumRows}/{sortExpression}', defaults: { startRowIndex: 0, maximumRows: 10, sortExpression: 'Name'}, trackCrumbTrail: false, title: 'Person Search', transitions: [
			{ key: 'select', to: 'details' }]},
		{ key: 'details', route: 'person', title: 'Person Details', }]}
]);

var personStates = Navigation.StateInfoConfig.dialogs.person.states;
personStates.list.navigated = function (data) {
	var people = personSearch.search(data.name, data.sortExpression);
	React.render(
		<List show={true} people={people} />,
		document.getElementById('content')
	);
};
personStates.list.dispose = function () { 
	React.render(
		<List show={false} />,
		document.getElementById('content')
	);
}
Navigation.start();
