(function (win) {
    if (!win.refreshAjax) return;
    var clear = false;
    refreshAjax.navigating(function (req, resp) {
        clear = false;
        if (req.data && req.data.action == 'edit')
            document.querySelector('#todo-list input').editing = true;
    });
    refreshAjax.navigated(function (req, resp) {
        if (req.target && req.target.id === 'todo-form') {
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
        if (req.data && req.data.action === 'clear' && !clear)
            resp.panels = null;
    });
    refreshAjax.updated(function (req, resp) {
        if (req.target && req.target.getAttribute) {
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
        var el = document.querySelector('#todo-list input');
        if (el) {
            el.focus();
            el.value = el.value;
            el.addEventListener('blur', function (e) {
                if (!el.editing) {
                    refreshAjax.navigate({ action: 'clear' });
                    clear = true;
                }
            });
        } else if (req.target && req.target.id === 'todo-form') {
            document.getElementById('new-todo').focus();
        }
    }
    initEdit({ target: { id: 'todo-form' } });
})(window);
