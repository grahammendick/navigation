import getbabelRelayPlugin from 'babel-relay-plugin';
import schema from './schema.json';

module.exports = getbabelRelayPlugin(schema.data);