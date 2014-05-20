document.addEventListener('click', function (e) {
    if (e.target.tagName == 'A') {
        e.preventDefault();
        navigateAjax(e.target.getAttribute('href'), true)
    }
});
window.onpopstate = function (e) {
    navigateAjax(location.pathname + location.search, false)
};

var currentUrl = location.pathname + location.search;
function navigateAjax(newUrl, addHistory)
{
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            var panels = JSON.parse(req.responseText);
            for(var panelId in panels)
                document.getElementById(panelId).innerHTML = panels[panelId];
            currentUrl = newUrl;
            if (addHistory) {
                history.pushState(newUrl, '', newUrl);
            }
        }
    };
    req.open("get", newUrl, true);
    req.setRequestHeader('Navigation-Link', currentUrl);
    req.send();
}