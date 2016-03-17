function PersonViewModel(stateNavigator) {
	var self = this;
    self.stateController = stateNavigator;
	self.id = ko.observable();
	self.name = ko.observable();
	self.personName = ko.observable();
	self.dateOfBirth = ko.observable();
	self.people = ko.observableArray();
	self.sortExpression = ko.observable();
	self.previous = ko.observable();
	self.next = ko.observable();
	self.last = ko.observable();
	self.totalCount = ko.observable();
	self.nameChange = function () {
		var data = stateNavigator.stateContext.includeCurrentData({ name: self.name(), startRowIndex: null });
		stateNavigator.refresh(data);
	};

	var states = stateNavigator.states;
	states.people.navigated = function (data) {
		var people = personSearch.search(data.name, data.sortExpression);
		var totalRowCount = people.length;
		people = people.slice(data.startRowIndex, data.startRowIndex + data.maximumRows);
		self.name(data.name);
		self.people(people);
		self.sortExpression(data.sortExpression.indexOf('DESC') === -1 ? 'Name DESC' : 'Name');
		self.previous(Math.max(0, data.startRowIndex - data.maximumRows));
		self.next(data.startRowIndex + data.maximumRows);
		var remainder = totalRowCount % data.maximumRows;
		self.last(remainder != 0 ? totalRowCount - remainder : totalRowCount - data.maximumRows);
		if (self.next() >= totalRowCount) {
			self.next(data.startRowIndex);
			self.last(data.startRowIndex);
		}
		self.totalCount(totalRowCount);
	};
	states.person.navigated = function (data) {
		self.id(data.id);
		var person = personSearch.getDetails(data.id);
		self.personName(person.name);
		self.dateOfBirth(person.dateOfBirth);
	};
	states.person.dispose = function () { self.id(null); };
};

var stateNavigator = new Navigation.StateNavigator([
    { key: 'people', route: '{startRowIndex?}/{maximumRows?}/{sortExpression?}', defaults: { startRowIndex: 0, maximumRows: 10, sortExpression: 'Name'}, trackTypes: false, title: 'Person Search' },
    { key: 'person', route: 'person', defaultTypes: { id: 'number' }, trackTypes: false, trackCrumbTrail: true, title: 'Person Details' }
]/*, new Navigation.HashHistoryManager(true)*/);
ko.applyBindings(new PersonViewModel(stateNavigator));
stateNavigator.start();
