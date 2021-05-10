const jayson = require('jayson/promise');
const {PORT} = require('../config');

const client = jayson.client.http({
  port: PORT
});

module.exports = client;
