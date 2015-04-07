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
	var run = document.getElementById('run');
	var cheat = document.getElementById('cheat');
	var next = document.getElementById('next');
	run.addEventListener('click', function () {
		next.style.display = 'none';
		eval('(' + codeMirror.getValue() + ')')({});
		next.style.display = 'block';
	});
	cheat.addEventListener('click', function () {
		codeMirror.setValue(tutorial.answer);
		eval('(' + codeMirror.getValue() + ')')({});
		next.style.display = 'block';
	});
	next.addEventListener('click', function () {
		location.href = exercises[tutorial.part] + '.html';
	});
})(tutorial);