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
        if (req.readyState == 4) {
            document.getElementById('np1').innerHTML = JSON.parse(req.responseText)['np1'];
            currentUrl = newUrl;
            if (addHistory) {
                history.pushState(newUrl, '', newUrl);
            }
        }
    };
    req.open("get", newUrl, true);
    req.setRequestHeader('navigation', currentUrl);
    req.send();
}