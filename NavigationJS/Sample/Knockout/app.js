function WebmailViewModel() {
	// Data
	var self = this;
	self.folders = ['Inbox', 'Archive', 'Sent', 'Spam'];
	self.chosenFolderId = ko.observable();
	self.chosenFolderData = ko.observable();
	self.chosenMailData = ko.observable();

	// Behaviours    
	self.goToFolder = function (folder) {
		Navigation.StateController.navigate('webMail', { folder: folder });
	};
	self.goToMail = function (mail) {
		Navigation.StateController.navigate('select', { folder: Navigation.StateContext.data.folder, mailId: mail.id });
	};

	// Navigation
	folderState.navigated = function () {
		self.chosenFolderId(Navigation.StateContext.data.folder);
		self.chosenFolderData({ mails: [{ from: '', to: '', subject: 'test', date: '', id: '1' }] });
	};
	folderState.ended = function () { self.chosenFolderData(null); };
	mailState.navigated = function () {
		self.chosenFolderId(Navigation.StateContext.data.folder);
		self.chosenMailData({ from: '', to: '', subject: 'test', date: '', id: '1', messageContent: 'Hello' });
	};
	mailState.ended = function () { self.chosenMailData(null); };
};

// States
Navigation.StateInfoConfig.build([
	{ key: 'webMail', initial: 'folder', states: [
		{ key: 'folder', route: '{folder}', defaults: {folder: 'Inbox'}, trackCrumbTrail: false, transitions: [
			{ key: 'select', to: 'mail' }]},
		{ key: 'mail', route: '{folder}/{mailId}', defaults: { folder: 'Inbox' } }]}
]);
var folderState = Navigation.StateInfoConfig.dialogs.webMail.states.folder;
var mailState = Navigation.StateInfoConfig.dialogs.webMail.states.mail;

ko.applyBindings(new WebmailViewModel());

Navigation.StateController.navigateLink(Navigation.router.getData(window.location.hash).state, window.location.hash);
