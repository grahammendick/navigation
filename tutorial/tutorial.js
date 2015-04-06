var code = document.getElementById('code');
code.value = tutorial.exercise;
var codeMirror = CodeMirror.fromTextArea(code, {
	lineNumbers: true,
});
document.getElementById('run').addEventListener('click', function () {
	eval('(' + codeMirror.getValue() + ')')({});
});