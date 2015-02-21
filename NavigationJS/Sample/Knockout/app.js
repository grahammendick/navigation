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
	dialogs.WebMail.states.Folder.started = function () {
	};

	dialogs.WebMail.states.Mail.started = function () {
	};
};

Navigation.StateInfoConfig.build([
	{ key: 'WebMail', initial: 'Folder', states: [
		{ key: 'Folder', route: '{folder}', defaults: {folder: 'inbox'}, transitions: [
			{ key: 'select', to: 'Mail' }]},
		{ key: 'Mail', route: 'f/{folder}/{mailId}', defaults: { folder: 'inbox' } }]}
]);

ko.applyBindings(new WebmailViewModel());

Navigation.StateController.navigateLink(Navigation.router.getData(window.location.hash).state, window.location.hash)
