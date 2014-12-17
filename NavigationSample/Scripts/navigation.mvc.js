﻿(function (win) {

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
        refreshAjax(link, data, true, target);
    }
    
    function refreshAjax(newLink, data, addHistory, target, title) {
        var req = {
            link: newLink,
            data: data,
            target: target,
        };
        raiseEvent('navigating', req, null);
        var resp = {
            history: addHistory ? 'add' : null,
            title: title ? title : win.document.title
        };
        var ajaxReq = new win.XMLHttpRequest();
        ajaxReq.onreadystatechange = onReady(ajaxReq, req, resp);
        ajaxReq.open(data ? 'post' : 'get', getAjaxLink(newLink, target));
        if (data)
            ajaxReq.setRequestHeader("Content-Type", "application/json");
        ajaxReq.send(win.JSON.stringify(data));
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
            link += '&' + name.replace('-', '') + '=' + win.encodeURIComponent(value);
        return link;
    }

    var cache = {};
    function onReady(ajaxReq, req, resp) {
        var oldLink = link;
        return function () {
            if (ajaxReq.readyState === 4 && ajaxReq.status === 200) {
                var ajaxResp = win.JSON.parse(ajaxReq.responseText);
                if (ajaxResp.RedirectLink) {
                    win.location.href = ajaxResp.RedirectLink;
                    return;
                }
                if (link !== oldLink)
                    return;
                if (ajaxResp.Title)
                    resp.title = ajaxResp.Title;
                resp.panels = ajaxResp.Panels;
                resp.link = ajaxResp.Link;
                handleRespone(req, resp);
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
        raiseEvent('navigated', req, resp);
        for (var id in resp.panels) {
            var panel = win.document.getElementById(id);
            backResp.panels[id] = panel.innerHTML;
            panel.innerHTML = resp.panels[id];
        }
        raiseEvent('updated', req, resp);
        var newLink = resp.link;
        if (link !== newLink) {
            cacheResponse(resp, backResp);
            if (resp.history === 'add')
                win.history.pushState(resp.title, resp.title, newLink);
            if (resp.history === 'replace')
                win.history.replaceState(resp.title, resp.title, newLink);
        }
        win.document.title = resp.title;
        link = newLink;
    }

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
                    var resp = cache[path[i] + '&' + path[i + 1]];
                    handleRespone(null, resp);
                }
            } else
                refreshAjax(newLink, null, false, null, e.state);
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
        updated: getAddHandler('updated')
};
})(window);