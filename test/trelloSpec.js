'use strict'

const {expect, trello} = require('./spec_helper')

describe('getting', () => {
  it ('an invalid field', () => {
    expect(() => trello.getCardField(123, 'jungle')).to.throw(/field.*invalid/)
  })
})
