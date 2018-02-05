import fs from 'fs'
import path from 'path'
import schema from './src/schema'
import { graphql } from 'graphql'
import { introspectionQuery } from 'graphql/utilities'

graphql(schema, introspectionQuery).then(result => {
    fs.writeFileSync(
        path.join(__dirname, './schema.json'),
        JSON.stringify(result, null, 2)
    );
});
