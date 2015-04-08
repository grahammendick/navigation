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
				if (i + 1 === tutorial.part)
					exercise.parentNode.className += ' active';
				if (i + 1 === part)
					exercise.parentNode.className += ' last';
				exercise.href = exercises[i] + '.html';
			}
		}
	}
	setExercises();
	function setNames(code) {
		var settings = getSettings();
		code = code.replace(/{dialog}/g, settings.dialog);
		code = code.replace(/{listing}/g, settings.listing);
		code = code.replace(/{details}/g, settings.details);
		code = code.replace(/{transition}/g, settings.transition);
		return code;
	}
	var code = document.getElementById('code');
	code.value = setNames(tutorial.exercise);
	var codeMirror = CodeMirror.fromTextArea(code, {
		lineNumbers: true,
	});
	var result = {};
	function clearResult() {
		delete result.navigated;
		delete result.listing;
		delete result.id;
		delete result.pageNumber;
	}
	var lastState;
	Navigation.StateHandler.prototype.navigateLink = function (oldState) {
		lastState = oldState;
		clearResult();
	};
	var resultCopy;
	Navigation.StateController.onNavigate(function () {
		resultCopy = {
			navigated: result.navigated,
			listing: result.listing,
			id: result.id,
			pageNumber: result.pageNumber
		}
	});
	function runCode() {
		next.style.display = 'none';
		clearResult();
		lastState = null;
		delete Navigation.StateContext.state;
		delete Navigation.StateContext.data;
		try{
			eval('(' + codeMirror.getValue() + ')')(result);
			var dialog = Navigation.StateInfoConfig._dialogs[0];
			test();
			var listing = dialog._states[0];
			var details = dialog._states[1];
			if (resultCopy)
				result = resultCopy;
			if (tutorial.test)
				tutorial.test(listing, details, result, lastState);
		} catch (e) {
			run.className = 'fail';
			throw e;
		}
		run.className = 'pass';
		var settings = getSettings();
		settings.part = Math.max(settings.part, Math.min(tutorial.part + 1, 11));
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
	function test() {
		if (Navigation.StateInfoConfig._dialogs.length !== 1)
			throw "There should be exactly one Dialog"
		var dialog = Navigation.StateInfoConfig._dialogs[0];
		if (dialog._states.length !== 2)
			throw "There should be exactly two States"
		if (dialog.initial !== dialog._states[0])
			throw "The Dialog's initial State should be the first State"
		if (dialog._states[1]._transitions.length !== 0)
			throw "The details State shouldn't have any Transitions"
		if (tutorial.part > 4) {
			if (dialog._states[0]._transitions.length !== 1)
				throw "The listing State should have exactly one Transition"
		}
	}
	var run = document.getElementById('run');
	var cheat = document.getElementById('cheat');
	var next = document.getElementById('next');
	run.addEventListener('click', function () {
		runCode();
	});
	cheat.addEventListener('click', function () {
		codeMirror.setValue(setNames(tutorial.answer));
		runCode();
	});
	next.addEventListener('click', function () {
		location.href = exercises[tutorial.part] + '.html';
	});
})(tutorial);