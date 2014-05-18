document.addEventListener('click', function (e) {
    if (e.target.tagName == 'A') {
        e.preventDefault();
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                document.getElementById('np1').innerHTML = JSON.parse(req.responseText)['np1'];
            }
        };
        req.open("get", e.target.href, true);
        req.setRequestHeader('navigation', location.pathname + location.search);
        req.send();
    }
});