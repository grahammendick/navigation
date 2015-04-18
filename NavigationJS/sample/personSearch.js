var personSearch = (function () {
	var people = [
		{ id: 1, name: 'Bob', dateOfBirth: '12/12/1980' },
		{ id: 2, name: 'Brenda', dateOfBirth: '01/06/1970' },
		{ id: 3, name: 'Barney', dateOfBirth: '25/10/1960' },
		{ id: 4, name: 'Billy', dateOfBirth: '12/12/1980' },
		{ id: 5, name: 'Bertha', dateOfBirth: '01/06/1970' },
		{ id: 6, name: 'Bert', dateOfBirth: '25/10/1960' },
		{ id: 7, name: 'Benny', dateOfBirth: '12/12/1980' },
		{ id: 8, name: 'Bella', dateOfBirth: '01/06/1970' },
		{ id: 9, name: 'Bridget', dateOfBirth: '25/10/1960' },
		{ id: 10, name: 'Beth', dateOfBirth: '12/12/1980' },
		{ id: 11, name: 'Brian', dateOfBirth: '01/06/1970' },
		{ id: 12, name: 'Bessie', dateOfBirth: '25/10/1960' }
	];

	function search(name, sortExpression) {
		var searchPeople = [];
		for (var i = 0; i < people.length; i++) {
			var person = people[i];
			if (!name || person.name.toUpperCase().indexOf(name.toUpperCase()) !== -1)
				searchPeople.push(person);
		}
		if (sortExpression) {
			searchPeople.sort(function (personA, personB) {
				var mult = sortExpression.indexOf('DESC') === -1 ? -1 : 1;
				return mult * (personA.name < personB.name ? 1 : -1);
			});
		}
		return searchPeople;
	}
	function getDetails(id) {
		for (var i = 0; i < people.length; i++) {
			var person = people[i];
			if (person.id === id)
				return person;
		}
		return null;
	}
	return {
		search: search,
		getDetails: getDetails
	}
})();
