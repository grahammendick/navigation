function WebmailViewModel() {
	// Data
	var self = this;
	self.folders = ['Inbox', 'Archive', 'Sent', 'Spam'];
	self.chosenFolderId = ko.observable();
	self.chosenFolderData = ko.observable();
	self.chosenMailData = ko.observable();

	// Behaviours    
	self.goToFolder = function (folder) { Navigation.StateController.refresh({ folder: folder }); };
	self.goToMail = function (mail) { };

	var folderState = Navigation.StateInfoConfig.dialogs.webMail.states.folder;
	var mailState = Navigation.StateInfoConfig.dialogs.webMail.states.mail;
	folderState.navigated = function () {
		self.chosenFolderId(Navigation.StateContext.data.folder);
	};

	folderState.ended = function () {
		self.chosenFolderData(null);
	};

	mailState.navigated = function () {
		self.chosenFolderId(Navigation.StateContext.data.folder);
	};

	mailState.ended = function () {
		self.chosenMailData(null);
	};
};

Navigation.StateInfoConfig.build([
	{ key: 'webMail', initial: 'folder', states: [
		{ key: 'folder', route: '{folder}', defaults: {folder: 'Inbox'}, trackCrumbTrail: false, transitions: [
			{ key: 'select', to: 'mail' }]},
		{ key: 'mail', route: '{folder}/{mailId}', defaults: { folder: 'Inbox' } }]}
]);

ko.applyBindings(new WebmailViewModel());

Navigation.StateController.navigateLink(Navigation.router.getData(window.location.hash).state, window.location.hash);
