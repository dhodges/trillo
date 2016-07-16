'use strict'

const {_, expect, jsonf, trello, trillo} = require('./spec_helper')

describe('getting card field', () => {
  it ('for an invalid field', () => {
    expect(() => trello.getCardField(123, 'jungle')).toThrow(/field.*invalid/)
  })
})
