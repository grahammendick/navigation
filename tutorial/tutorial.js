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
	function getSettings() {
		var names = localStorage.getItem('tutorial');
		if (!names) {
			return {
				part: 1,
				dialog: 'masterDetails',
				listing: 'listing',
				details: 'details',
				transition: 'select'
			}
		}
		return JSON.parse(names);
	}
	function setExercises() {
		for (var i = 0; i < exercises.length; i++) {
			var exercise = document.getElementById('e' + (i + 1));
			var part = getSettings().part;
			if (i < part) {
				exercise.parentNode.className = 'available';
				if (i + 1 == tutorial.part)
					exercise.parentNode.className += ' active';
				exercise.href = exercises[i] + '.html';
			}
		}
	}
	setExercises();
	var code = document.getElementById('code');
	code.value = tutorial.exercise;
	var codeMirror = CodeMirror.fromTextArea(code, {
		lineNumbers: true,
	});
	function runCode() {
		next.style.display = 'none';
		var result = {};
		eval('(' + codeMirror.getValue() + ')')(result);
		var dialog = Navigation.StateInfoConfig._dialogs[0];
		var listing = dialog._states[0];
		var details = dialog._states[1];
		if (tutorial.test)
			tutorial.test(listing, details, result);
		var settings = getSettings();
		settings.part = Math.max(settings.part, tutorial.part + 1);
		var nameRegex = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
		if (nameRegex.exec(listing.key) && nameRegex.exec(details.key)) {
			settings.dialog = dialog.key;
			settings.listing = listing.key;
			settings.details = details.key;
			settings.transition = 'select';
			if (listing._transitions.length !== 0)
				settings.transition = listing._transitions[0].key;
		}
		localStorage.setItem('tutorial', JSON.stringify(settings));
		next.style.display = 'block';
		setExercises();
	}
	var run = document.getElementById('run');
	var cheat = document.getElementById('cheat');
	var next = document.getElementById('next');
	run.addEventListener('click', function () {
		runCode();
	});
	cheat.addEventListener('click', function () {
		codeMirror.setValue(tutorial.answer);
		runCode();
	});
	next.addEventListener('click', function () {
		location.href = exercises[tutorial.part] + '.html';
	});
})(tutorial);