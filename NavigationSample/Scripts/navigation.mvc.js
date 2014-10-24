(function (win) {

    if (!(win.history && win.history.pushState))
        return;

    var submitData = {};
    win.document.addEventListener('click', function (e) {
        var element = e.target;
        var anchor = getAjaxTarget(element, 'A');
        if (!e.ctrlKey && !e.shiftKey && anchor) {
            e.preventDefault();
            refreshAjax(anchor.getAttribute('href'), true, anchor);
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
        var form = getAjaxTarget(e.target, 'FORM');
        if (form) {
            var req = new win.XMLHttpRequest();
            req.onreadystatechange = onReady(req, true);
            e.preventDefault();
            req.open('post', getAjaxLink(form.getAttribute('action'), form));
            req.setRequestHeader("Content-Type", "application/json");
            req.send(win.JSON.stringify(getFormData(form)));
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

    function getAjaxTarget(element, tagName) {
        var target = null;
        while (element) {
            if (element.getAttribute) {
                var navigation = element.getAttribute('data-navigation');
                if (!target && element.tagName === tagName && navigation === 'refresh')
                    target = element;
                if (navigation === 'noajax')
                    return null;
            }
            element = element.parentNode;
        }
        return target;
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
            baseLink = setLinkData(target, baseLink, 'include-current');
            baseLink = setLinkData(target, baseLink, 'current-keys');
            baseLink = setLinkData(target, baseLink, 'to-keys');
        }
        return baseLink;
    }

    function setLinkData(target, link, name) {
        var value = target.getAttribute('data-' + name);
        if (value)
            link += '&' + name.replace('-','') + '=' + win.encodeURIComponent(value);
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

    var neighbourhood = {};
    neighbourhood[link] = [];
    var links = [link];
    function handleRespone(resp, addHistory, oldLink) {
        if (resp.RedirectLink) {
            win.location.href = resp.RedirectLink;
            return;
        }
        if (link !== oldLink)
            return;
        var backResp = {};
        backResp.Link = link;
        backResp.Title = win.document.title;
        backResp.Panels = {};
        for (var id in resp.Panels) {
            var panel = win.document.getElementById(id);
            backResp.Panels[id] = panel.innerHTML;
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
        cacheResponse(resp, backResp);
        var newLink = resp.Link;
        if (addHistory && link !== newLink)
            win.history.pushState(resp.Title, resp.Title, newLink);
        win.document.title = resp.Title;
        link = newLink;
    }

    function cacheResponse(resp, backResp) {
        var newLink = resp.Link;
        cache[link + '&' + newLink] = resp;
        cache[newLink + '&' + link] = backResp;
        if (links.indexOf(newLink) === -1) {
            neighbourhood[newLink] = [];
            links.push(newLink);
        }
        if (neighbourhood[link].indexOf(newLink) === -1) {
            neighbourhood[link].push(newLink);
            neighbourhood[newLink].push(link);
        }
    }

    win.addEventListener('popstate', function (e) {
        var newLink = win.location.pathname + win.location.search;
        if (link !== newLink) {
            var path = getShortestPath(link, newLink);
            if (!path)
                refreshAjax(newLink, false, null, e.state);
            else {
                try {
                    for (var i = 0; i < path.length - 1; i++) {
                        var resp = cache[path[i] + '&' + path[i + 1]];
                        handleRespone(resp, false, path[i]);
                    }
                } catch (ex) {
                    refreshAjax(newLink, false, null, e.state);
                }
            }
        }
    });

    function getShortestPath(fromLink, toLink) {
        var previous = {};
        var distances = {};
        var unlinks = [];
        var max = links.length;
        for (var i = 0; i < links.length; i++) {
            unlinks.push(links[i]);
            distances[links[i]] = max;
        }
        var distance = distances[fromLink] = 0;
        while (unlinks.length != 0) {
            distance++;
            var link = unlinks.sort(function (x, y) { return distances[x] - distances[y] })[0];
            if (link === toLink)
            {
                var path = [];
                while (toLink) {
                    path.push(toLink);
                    toLink = previous[toLink];
                }
                return path.reverse();
            }
            var neighbours = neighbourhood[link];
            for (var i = 0; i < neighbours.length; i++) {
                var neighbour = neighbours[i];
                if (distances[neighbour] === max) {
                    distances[neighbour] = distance;
                    previous[neighbour] = link;
                }
            }
            unlinks.shift();
        }
        return null;
    }
})(window);