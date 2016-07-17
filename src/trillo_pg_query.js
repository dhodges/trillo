'use strict';

require('dotenv').config()

var query   = require('pg-query')
var user    = process.env.DB_USER || process.env.USER
if (process.env.DB_PASSWORD) {
  user = user + `:${process.env.DB_PASSWORD}`
}
var host    = process.env.DB_HOST || 'localhost'
var port    = process.env.DB_PORT || '5432'
var db_name = process.env.DB_NAME || 'trillo'

query.connectionParameters = `postgres://${user}@${host}:${port}/${db_name}`

module.exports.query = query
