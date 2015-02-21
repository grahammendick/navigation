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
};

ko.applyBindings(new WebmailViewModel());