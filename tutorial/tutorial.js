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
	function getNames() {
		var names = localStorage.getItem('tutorial');
		if (!names) {
			return {
				dialog: 'masterDetails',
				listing: 'listing',
				details: 'details',
				transition: 'select'
			}
		}
		return JSON.parse(names);
	}
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
		next.style.display = 'none';
		eval('(' + codeMirror.getValue() + ')')({});
		var dialog = Navigation.StateInfoConfig._dialogs[0];
		var listing = dialog._states[0];
		var details = dialog._states[1];
		var names = getNames();
		var nameRegex = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
		if (nameRegex.exec(listing.key) && nameRegex.exec(details.key)) {
			names.dialog = dialog.key;
			names.listing = listing.key;
			names.details = details.key;
			names.transition = 'select';
			if (listing._transitions.length !== 0)
				names.transition = listing._transitions[0].key;
		}
		localStorage.setItem('tutorial', JSON.stringify(names));
		next.style.display = 'block';
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