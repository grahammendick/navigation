import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './schema';

const app = express();

app.use(express.static('src/js'))

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.get('/', function (req, res) {
    res.send(`<html>
        <head>
            <title>Navigation Relay</title>
            <style>
                table{border-collapse:collapse;}
                table,td,th{border:1px #000 solid;}
                .label{margin-left:50px;width:100px;float:left;}
            </style>
        </head>
        <body>
            <div id="content"></div>
            <script src="/app.js" ></script>
        </body>
    </html>`);
});

app.listen(8080);
