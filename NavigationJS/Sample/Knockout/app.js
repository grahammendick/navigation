function WebmailViewModel() {
	// Data
	var self = this;
	self.folders = ['Inbox', 'Archive', 'Sent', 'Spam'];
	self.chosenFolderId = ko.observable();
	self.chosenFolderData = ko.observable();
	self.chosenMailData = ko.observable();

	// Behaviours    
	self.goToFolder = function (folder) { };
	self.goToMail = function (mail) { };

	var dialogs = Navigation.StateInfoConfig.dialogs;
	dialogs.webMail.states.folder.started = function () {
	};

	dialogs.webMail.states.mail.started = function () {
	};
};

Navigation.StateInfoConfig.build([
	{ key: 'webMail', initial: 'folder', states: [
		{ key: 'folder', route: '{folder}', defaults: {folder: 'inbox'}, transitions: [
			{ key: 'select', to: 'mail' }]},
		{ key: 'mail', route: '{folder}/{mailId}', defaults: { folder: 'inbox' } }]}
]);

ko.applyBindings(new WebmailViewModel());

Navigation.StateController.navigateLink(Navigation.router.getData(window.location.hash).state, window.location.hash)
