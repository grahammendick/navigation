import fs from 'fs'
import path from 'path'
import schema from './schema.js'
import { graphql } from 'graphql'
import { introspectionQuery, printSchema } from 'graphql/utilities'

// Save JSON of full schema introspection for Babel Relay Plugin to use
(async () => {
  var result = await (graphql(schema, introspectionQuery))
    fs.writeFileSync(
        path.join(__dirname, './schema.json'),
        JSON.stringify(result, null, 2)
    )
})()

// Save user readable type system shorthand of schema
fs.writeFileSync(
  path.join(__dirname, './schema.graphql'),
  printSchema(schema)
)