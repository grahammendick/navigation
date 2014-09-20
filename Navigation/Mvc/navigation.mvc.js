(function (win) {

    if (!(win.history && win.history.pushState))
        return;

    var submitData = {};
    win.document.addEventListener('click', function (e) {
        var element = e.target;
        if (!e.ctrlKey && !e.shiftKey && ajaxOn(element, 'A')) {
            e.preventDefault();
            refreshAjax(element.getAttribute('href'), true, element);
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

    win.document.addEventListener('submit', function (e) {
        var element = e.target;
        if (ajaxOn(element, 'FORM')) {
            var req = new win.XMLHttpRequest();
            req.onreadystatechange = onReady(req, true);
            e.preventDefault();
            req.open('post', getAjaxLink(element.getAttribute('action'), element));
            req.setRequestHeader("Content-Type", "application/json");
            req.send(win.JSON.stringify(getFormData(element)));
        }
    });

    var tagNames = /^INPUT|TEXTAREA|SELECT$/;
    var ignoreTypes = /^button|image|submit|reset|file$/;
    var checkTypes = /^checkbox|radio$/;
    function getFormData(form) {
        var elements = form.elements;
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
        return data;
    }

    function ajaxOn(element, tagName) {
        if (element.tagName === tagName
            && element.getAttribute('data-navigation') === 'refresh') {
            var ajax = true;
            while (!!element && ajax) {
                if (element.getAttribute)
                    ajax = element.getAttribute('data-navigation') !== 'noajax';
                element = element.parentNode;
            }
            return ajax;
        }
        return false;
    }

    var link = win.location.pathname + win.location.search;
    function refreshAjax(newLink, addHistory, target, title) {
        var req = new win.XMLHttpRequest();
        req.onreadystatechange = onReady(req, addHistory, title);
        req.open('get', getAjaxLink(newLink, target));
        req.send();
    }

    function getAjaxLink(baseLink, target) {
        baseLink += baseLink.indexOf('?') > 0 ? '&' : '?';
        baseLink += 'refreshajax=' + win.encodeURIComponent(link);
        baseLink += '&navigation=' + (target ? 'refresh' : 'history');
        if (target) {
            baseLink = setData(target, baseLink, 'data-include-current', 'includecurrent');
            baseLink = setData(target, baseLink, 'data-current-keys', 'currentkeys');
            baseLink = setData(target, baseLink, 'data-to-keys', 'tokeys');
        }
        return baseLink;
    }

    function setData(target, link, attribute, name) {
        var value = target.getAttribute(attribute);
        if (value)
            link += '&' + name + '=' + win.encodeURIComponent(value);
        return link;
    }

    var cache = {};
    function onReady(req, addHistory, title) {
        var oldLink = link;
        return function () {
            if (req.readyState === 4 && req.status === 200) {
                var resp = win.JSON.parse(req.responseText);
                if (!resp.Title)
                    resp.Title = title ? title : win.document.title;
                handleRespone(resp, addHistory, oldLink);
            }
        };
    }

    function handleRespone(resp, addHistory, oldLink) {
        var newLink = resp.Link;
        cache[oldLink + '&' + newLink] = resp;
        if (link !== oldLink)
            return;
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
        if (addHistory && link !== newLink)
            win.history.pushState(resp.Title, resp.Title, newLink);
        win.document.title = resp.Title;
        link = newLink;
    }

    win.addEventListener('popstate', function (e) {
        var newLink = win.location.pathname + win.location.search;
        if (link !== newLink) {
            var resp = cache[link + '&' + newLink];
            if (!resp)
                refreshAjax(newLink, false, null, e.state);
            else {
                try {
                    handleRespone(resp, false, link);
                } catch (ex) {
                    refreshAjax(newLink, false, null, e.state);
                }
            }
        }
    });
})(window);