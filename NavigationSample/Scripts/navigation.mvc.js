(function (win) {

    if (!(win.history && win.history.pushState))
        return;

    var submitData = {};
    win.document.addEventListener('click', function (e) {
        var element = e.target;
        if (!e.ctrlKey && !e.shiftKey && ajaxOn(element, 'A')) {
            e.preventDefault();
            refreshAjax(element.getAttribute('href'), true);
        }
        if (element.tagName === 'INPUT' && element.name) {
            if (element.type === 'submit')
                submitData[element.name] = element.value;
            if (element.type === 'image') {
                submitData[element.name + '.x'] = win.Math.max(0, e.offsetX);
                submitData[element.name + '.y'] = win.Math.max(0, e.offsetY);
            }
        }
    });

    var tagNames = /^(INPUT|TEXTAREA|SELECT)$/;
    var ignoreTypes = /^(button|image|submit|reset|file)$/;
    var checkTypes = /^(checkbox|radio)$/;
    win.document.addEventListener('submit', function (e) {
        if (ajaxOn(e.target, 'FORM')) {
            var elements = e.target.elements;
            var req = new win.XMLHttpRequest();
            req.onreadystatechange = onReady(req, true, null);
            var data = {};
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                if (tagNames.test(element.tagName) && element.name
                    && !ignoreTypes.test(element.type) && !element.disabled
                    && (!checkTypes.test(element.type) || element.checked))
                    data[element.name] = element.value;
            }
            for (var key in submitData)
                data[key] = submitData[key];
            submitData = {};
            e.preventDefault();
            req.open('post', getAjaxLink(e.target.getAttribute('action')));
            req.setRequestHeader("Content-Type", "application/json");
            req.send(win.JSON.stringify(data));
        }
    });

    function ajaxOn(element, tagName) {
        if (element.tagName === tagName
            && element.getAttribute('data-navigation') === 'refresh') {
            var ajax = true;
            while (element != null && ajax) {
                if (element.getAttribute)
                    ajax = element.getAttribute('data-navigation') !== 'noajax';
                element = element.parentNode;
            }
            return ajax;
        }
        return false;
    }

    win.addEventListener('popstate', function (e) {
        refreshAjax(win.location.pathname + win.location.search, false)
    });

    var link = win.location.pathname + win.location.search;
    function refreshAjax(newLink, addHistory) {
        var req = new win.XMLHttpRequest();
        req.onreadystatechange = onReady(req, addHistory, newLink);
        req.open('get', getAjaxLink(newLink));
        req.send();
    }

    function getAjaxLink(baseLink) {
        baseLink += baseLink.indexOf('?') > 0 ? '&' : '?';
        baseLink += 'refreshajax=' + win.encodeURIComponent(link);
        return baseLink;
    }

    function onReady(req, addHistory, newLink) {
        return function () {
            if (req.readyState === 4 && req.status === 200) {
                var resp = win.JSON.parse(req.responseText);
                for (var id in resp.Panels) {
                    var panel = win.document.getElementById(id);
                    panel.innerHTML = resp.Panels[id];
                    var evt;
                    if (typeof win.Event === 'function')
                        evt = new win.Event('refreshajax');
                    else {
                        evt = win.document.createEvent('Event');
                        evt.initEvent('refreshajax', false, false);
                    }
                    panel.dispatchEvent(evt);
                }
                if (!newLink)
                    newLink = resp.Link;
                if (addHistory)
                    win.history.pushState(newLink, win.document.title, newLink);
                link = newLink;
            }
        };
    }
})(window);