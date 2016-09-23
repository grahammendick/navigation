import http from 'http';
import { graphql } from 'graphql';
import schema from './schema';

http.createServer(function(req, res) {
    graphql(schema, req.body)
        .then((result) => {
            res.write(JSON.stringify(result));
            res.end();
        });
}).listen(8080);