(function (tutorial) {
	var exercises = [
		'configuringstates',
		'accessingstates',
		'navigatingdialog',
		'creatingstatecontroller',
		'configuringtransition',
		'navigatingtransition',
		'navigatingback',
		'passingdata',
		'refreshing',
		'rememberingdata',
		'tidyingurl',
	];
	for (var i = 0; i < exercises.length; i++) {
		var exercise = document.getElementById('e' + (i + 1));
		if (i < tutorial.part) {
			exercise.parentNode.className = 'available';
			if (i + 1 == tutorial.part)
				exercise.parentNode.className += ' active';
			exercise.href = exercises[i] + '.html';
		}
	}
	var code = document.getElementById('code');
	code.value = tutorial.exercise;
	var codeMirror = CodeMirror.fromTextArea(code, {
		lineNumbers: true,
	});
	function runCode() {
		eval('(' + codeMirror.getValue() + ')')({});
		var dialog = Navigation.StateInfoConfig._dialogs[0];
		var listing = dialog._states[0];
		var details = dialog._states[1];
		var dialogName = 'masterDetails';
		var listingName = 'listing';
		var detailsName = 'details';
		var transitionName = 'select';
		var nameRegex = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
		if (nameRegex.exec(listing.key) && nameRegex.exec(details.key)) {
			dialogName = dialog.key;
			listingName = listing.key;
			detailsName = details.key;
			if (listing._transitions.length !== 0)
				transitionName = listing._transitions[0].key;
		}
		localStorage.setItem('tutorial', JSON.stringify({
			dialog: dialogName,
			listing: listingName,
			details: detailsName,
			transition: transitionName
		}));
	}
	var run = document.getElementById('run');
	var cheat = document.getElementById('cheat');
	var next = document.getElementById('next');
	run.addEventListener('click', function () {
		next.style.display = 'none';
		runCode();
		next.style.display = 'block';
	});
	cheat.addEventListener('click', function () {
		codeMirror.setValue(tutorial.answer);
		runCode();
		next.style.display = 'block';
	});
	next.addEventListener('click', function () {
		location.href = exercises[tutorial.part] + '.html';
	});
})(tutorial);