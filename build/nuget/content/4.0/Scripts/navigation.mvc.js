(function (win) {

    if (!(win.history && win.history.pushState))
        return;

    var submitData = {};
    win.document.addEventListener('click', function (e) {
        var element = e.target;
        var anchor = getAjaxTarget(element, 'A');
        if (!e.ctrlKey && !e.shiftKey && anchor) {
            e.preventDefault();
            refreshAjax(anchor.getAttribute('href'), null, true, anchor);
        }
        if ((element.tagName === 'INPUT' || element.tagName === 'BUTTON') && element.name) {
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
            e.preventDefault();
            refreshAjax(form.getAttribute('action'), getFormData(form), true, form);
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
    function navigate(data, target) {
        refreshAjax(link, data, true, target || {});
    }

    function refreshAjax(newLink, data, history, target, title) {
        var req = {
            link: newLink,
            data: data,
            target: target
        };
        raiseEvent('navigating', req, null);
        var resp = {
            history: history,
            title: title ? title : win.document.title
        };
        var ajaxReq = new win.XMLHttpRequest();
        ajaxReq.onreadystatechange = onReady(ajaxReq, req, resp);
        ajaxReq.open(data ? 'post' : 'get', getAjaxLink(req, resp));
        if (data)
            ajaxReq.setRequestHeader("Content-Type", "application/json");
        ajaxReq.send(win.JSON.stringify(data));
    }

    function getAjaxLink(req, resp) {
        var baseLink = req.link;
        baseLink += baseLink.indexOf('?') > 0 ? '&' : '?';
        baseLink += 'refreshajax=' + win.encodeURIComponent(link);
        baseLink += '&navigation=' + (resp.history ? 'refresh' : 'history');
        if (req.target.getAttribute) {
            baseLink = setLinkData(req.target, baseLink, 'include-current');
            baseLink = setLinkData(req.target, baseLink, 'current-keys');
            baseLink = setLinkData(req.target, baseLink, 'to-keys');
        }
        return baseLink;
    }

    function setLinkData(target, link, name) {
        var value = target.getAttribute('data-' + name);
        if (value)
            link += '&' + name.replace('-', '') + '=' + win.encodeURIComponent(value);
        return link;
    }

    function onReady(ajaxReq, req, resp) {
        var oldLink = link;
        return function () {
            if (ajaxReq.readyState === 4) {
                if (ajaxReq.status === 200) {
                    var ajaxResp = win.JSON.parse(ajaxReq.responseText);
                    if (ajaxResp.Title)
                        resp.title = ajaxResp.Title;
                    resp.panels = ajaxResp.Panels;
                    resp.link = ajaxResp.Link;
                    raiseEvent('navigated', req, resp);
                    if (ajaxResp.RedirectLink) {
                        win.location.href = ajaxResp.RedirectLink;
                        return;
                    }
                    if (link !== oldLink)
                        return;
                    handleRespone(req, resp);
                } else {
                    raiseEvent('navigated', req, resp);
                }
            }
        };
    }

    var neighbourhood = {};
    neighbourhood[link] = [];
    var links = [link];
    function handleRespone(req, resp) {
        var backResp = {};
        backResp.link = link;
        backResp.title = win.document.title;
        backResp.panels = {};
        raiseEvent('updating', req, resp);
        if (!resp.panels)
            return;
        for (var id in resp.panels) {
            var panel = win.document.getElementById(id);
            if (panel) {
                backResp.panels[id] = panel.innerHTML;
                panel.innerHTML = resp.panels[id];
            }
        }
        raiseEvent('updated', req, resp);
        if (link !== resp.link) {
            cacheResponse(resp, backResp);
            if (resp.history)
                win.history.pushState(resp.title, resp.title, resp.link);
        }
        win.document.title = resp.title;
        link = resp.link;
    }

    var cache = {};
    function cacheResponse(resp, backResp) {
        var newLink = resp.link;
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
            if (path) {
                for (var i = 0; i < path.length - 1; i++) {
                    var req = {
                        link: path[i + 1],
                        target: win
                    };
                    var resp = cache[path[i] + '&' + path[i + 1]];
                    resp.history = null;
                    handleRespone(req, resp);
                }
            } else
                refreshAjax(newLink, null, false, win, e.state);
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
        while (unlinks.length !== 0) {
            distance++;
            var link = unlinks.sort(function (x, y) {
                return distances[x] - distances[y]
            })[0];
            if (link === toLink) {
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

    var handlers = {};
    function getAddHandler(eventName) {
        return function (handler) {
            if (!handlers[eventName])
                handlers[eventName] = [];
            handlers[eventName].push(handler);
        };
    }

    function raiseEvent(eventName, req, resp) {
        if (!handlers[eventName])
            return;
        for (var i = 0; i < handlers[eventName].length; i++)
            handlers[eventName][i](req, resp);
    }

    win.refreshAjax = {
        navigate: navigate,
        navigating: getAddHandler('navigating'),
        navigated: getAddHandler('navigated'),
        updating: getAddHandler('updating'),
        updated: getAddHandler('updated')
    };
})(window);