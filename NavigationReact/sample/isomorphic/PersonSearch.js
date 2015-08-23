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

exports.search = function(pageNumber, callback) {
	var start = (pageNumber - 1) * 10;
	var page = people.slice(start, start + 10);
	setTimeout(function() {
		callback(page);
	}, 10);
};