function PersonViewModel() {
    var self = this;
    self.id = ko.observable();
    self.name = ko.observable();
    self.personName = ko.observable();
    self.dateOfBirth = ko.observable();
    self.people = ko.observableArray();
    self.sortExpression = ko.observable();
    self.previous = ko.observable();
    self.previousVisible = ko.observable();
    self.next = ko.observable();
    self.nextVisible = ko.observable();
    self.last = ko.observable();
    self.totalCount = ko.observable();
    self.name.subscribe(function (val) {
        Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData({ name: val, startRowIndex: null }));
    });

	var personStates = Navigation.StateInfoConfig.dialogs.person.states;
	personStates.list.navigated = function (data) {
	    var people = personSearch.search(data.name, data.sortExpression);
	    var totalRowCount = people.length;
	    people = people.slice(data.startRowIndex, data.startRowIndex + data.maximumRows);
	    self.name(data.name);
	    self.people(people);
	    self.sortExpression(data.sortExpression.indexOf('DESC') === -1 ? 'Name DESC' : 'Name');
	    self.previous(data.startRowIndex - data.maximumRows);
	    self.previousVisible(self.previous() >= 0);
	    self.next(data.startRowIndex + data.maximumRows);
	    self.nextVisible(self.next() < totalRowCount);
	    var remainder = totalRowCount % data.maximumRows;
	    self.last(remainder != 0 ? totalRowCount - remainder : totalRowCount - dat.maximumRows);
	    self.totalCount(totalRowCount);
	};
	personStates.details.navigated = function (data) {
	    self.id(data.id);
	    var person = personSearch.getDetails(data.id);
	    self.personName(person.name);
	    self.dateOfBirth(person.dateOfBirth);
	};
	webMailStates.details.dispose = function () { self.id(null); };
	Navigation.start();
};

Navigation.StateInfoConfig.build([
	{ key: 'person', initial: 'list', states: [
		{ key: 'list', route: '{startRowIndex}/{maximumRows}/{sortExpression}', defaults: { startRowIndex: 0, maximumRows: 10, sortExpression: 'Name'}, trackCrumbTrail: false, title: 'Person Search', transitions: [
			{ key: 'select', to: 'details' }]},
		{ key: 'details', route: 'person', title: 'Person Details', }]}
]);
ko.applyBindings(new PersonViewModel());
