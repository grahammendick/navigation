function WebmailViewModel() {
	// Data
	var self = this;
	self.folders = ['Inbox', 'Archive', 'Sent', 'Spam'];
	self.chosenFolderId = ko.observable();
	self.chosenFolderData = ko.observable();
	self.chosenMailData = ko.observable();

	// Navigation
	folderState.navigated = function (data) {
		self.chosenFolderId(data.folder);
		self.chosenFolderData(getMails(data.folder));
	};
	folderState.dispose = function () { self.chosenFolderData(null); };
	mailState.navigated = function (data) {
		self.chosenFolderId(data.folder);
		self.chosenMailData(getMail(data.mailId));
	};
	mailState.dispose = function () { self.chosenMailData(null); };
};

// States
Navigation.StateInfoConfig.build([
	{ key: 'webMail', initial: 'folder', states: [
		{ key: 'folder', route: '{folder}', defaults: {folder: 'Inbox'}, trackCrumbTrail: false, transitions: [
			{ key: 'select', to: 'mail' }]},
		{ key: 'mail', route: '{folder}/{mailId}', defaults: { folder: 'Inbox' }, defaultTypes: { mailId: 'number' }, trackCrumbTrail: false }]}
]);
var folderState = Navigation.StateInfoConfig.dialogs.webMail.states.folder;
var mailState = Navigation.StateInfoConfig.dialogs.webMail.states.mail;

ko.applyBindings(new WebmailViewModel());

Navigation.start();
