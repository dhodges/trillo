'use strict'
import 'babel-polyfill'

let expect = require('expect')
let trillo = require('../dist/trillo')

describe('trillo', () => {
    return it('knows black from white', () => {
        return expect('black').toNotEqual('white')
    })
})

trillo.run()
