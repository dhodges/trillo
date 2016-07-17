'use strict'
import 'babel-polyfill'

require('dotenv').config()

const _      = require('lodash'),
      expect = require('chai').expect,
      jsonf  = require('jsonfile'),
      trillo = require('../dist/trillo'),
      Trello = require('../dist/trello').Trello,
      trello = new Trello({
        key:   process.env.TRELLO_API_KEY,
        token: process.env.TRELLO_API_TOKEN
      })

module.exports._      = _
module.exports.expect = expect
module.exports.jsonf  = jsonf
module.exports.trillo = trillo
module.exports.trello = trello
