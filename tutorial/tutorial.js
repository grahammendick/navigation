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
	document.getElementById('run').addEventListener('click', function () {
		eval('(' + codeMirror.getValue() + ')')({});
	});
	document.getElementById('cheat').addEventListener('click', function () {
		codeMirror.setValue(tutorial.answer);
	});
})(tutorial);