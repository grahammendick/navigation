(function (win) {
    
    if (!(win.history && win.history.pushState))
        return;

    win.document.addEventListener('click', function (e) {
        if (e.target.tagName && e.target.tagName == 'A') {
            e.preventDefault();
            refreshAjax(e.target.getAttribute('href'), true)
        }
    });

    win.addEventListener('popstate', function (e) {
        refreshAjax(win.location.pathname + win.location.search, false)
    });

    var link = win.location.pathname + win.location.search;
    function refreshAjax(newLink, addHistory)
    {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
                var panels = JSON.parse(req.responseText);
                for (var id in panels) {
                    document.getElementById(id).innerHTML = panels[id];
                    if (win.jQuery && jQuery.validator)
                        jQuery.validator.unobtrusive.parse('#' + id);
                }
                if (addHistory)
                    history.pushState(newLink, win.document.title, newLink);
                link = newLink;
            }
        };
        req.open('get', newLink, true);
        req.setRequestHeader('Navigation-Link', link);
        req.send();
    }

})(window);