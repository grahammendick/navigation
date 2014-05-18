document.addEventListener('click', function (e) {
    if (e.target.tagName == 'A') {
        e.preventDefault();
        navigateAjax(location.pathname + location.search, e.target.getAttribute('href'), true)
    }
});
var currentUrl = location.pathname + location.search;
window.onpopstate = function (e) {
    navigateAjax(currentUrl, location.pathname + location.search, false)
};

function navigateAjax(oldUrl, newUrl, addHistory)
{
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            document.getElementById('np1').innerHTML = JSON.parse(req.responseText)['np1'];
            currentUrl = newUrl;
            if (addHistory) {
                history.pushState(newUrl, '', newUrl);
            }
        }
    };
    req.open("get", newUrl, true);
    req.setRequestHeader('navigation', oldUrl);
    req.send();
}