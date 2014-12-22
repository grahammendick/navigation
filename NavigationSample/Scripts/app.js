(function (win) {
    'use strict';

    if (!win.refreshAjax) return;
    var edit = false;

    refreshAjax.navigating(function (req, resp) {
        edit = req.data && req.data.action == 'edit';
    });

    refreshAjax.updating(function (req, resp) {
        if (req.target.id === 'todo-form') {
            var newTodoId = 0;
            for (var id in resp.panels) {
                var todoId = Number(id.slice(4));
                if (todoId && newTodoId < todoId)
                    newTodoId = todoId;
            }
            if (newTodoId && !document.getElementById('todo' + newTodoId)) {
                document.getElementById('todo-list')
                    .insertAdjacentHTML('beforeend', '<li><span id="todo' + newTodoId + '" /></li>');
            }
        }
        if (req.data && req.data.action === 'edit' && !edit)
            resp.panels = null;
    });

    refreshAjax.updated(function (req, resp) {
        if (req.target.getAttribute) {
            var todoId = req.target.getAttribute('data-todo');
            if (todoId && !resp.panels['todo' + todoId]) {
                var todo = document.getElementById('todo' + todoId);
                if (todo) {
                    var listItem = todo.parentNode;
                    listItem.parentNode.removeChild(listItem);
                }
            }
        }
        initEdit(req);
    });

    function initEdit(req) {
        var el = document.querySelector('#todo-list input[type="text"]');
        if (el) {
            el.focus();
            el.value = el.value;
            el.addEventListener('blur', function (e) {
                if (!edit) {
                    refreshAjax.navigate({ action: 'edit', Title: el.value }, el);
                    edit = true;
                }
            });
            el.addEventListener('keyup', function (e) {
                if (!edit && e.keyCode == 27) {
                    refreshAjax.navigate({ action: 'clear' }, el);
                    edit = true;
                }
            });
        } else if (req.target.id === 'todo-form') {
            document.getElementById('new-todo').focus();
        }
    }

    initEdit({ target: { id: 'todo-form' } });
})(window);
