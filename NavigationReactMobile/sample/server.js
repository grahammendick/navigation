var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {
	if (req.url === '/favicon.ico') {
		res.statusCode = 404;
		res.end();
		return true;
	}
	var fileName;
	if (req.url === '/') {
		fileName = 'app.html'
		res.setHeader('content-type', 'text/html');
	} else {
		if (req.url.indexOf('/', 1) !== -1)
			fileName = '../..' + req.url;
		else
			fileName = req.url.substring(1);
		res.setHeader('content-type', 'text/javascript');
	}
	fs.createReadStream(fileName).pipe(res);
}).listen(8080);
